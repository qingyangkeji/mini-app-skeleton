import * as path from "path"
import * as os from "os"
import * as child_process from "child_process"
import * as fs from "fs-extra"
import * as gulp from "gulp"
import * as sourcemaps from "gulp-sourcemaps"
import * as ts from "gulp-typescript"
import * as stylus from "gulp-stylus"
import * as rename from "gulp-rename"
import * as log from "fancy-log"
import * as minimist from "minimist"
import * as postcss from "gulp-postcss"
import * as gulpIf from "gulp-if"
import * as cache from "gulp-cached"
import * as remember from "gulp-remember"
import * as Undertaker from 'Undertaker'
import chalk from "chalk"
import { isFixed, getNowTime } from './gulp.utils'
const autoprefixer = require('autoprefixer')
const eslint = require('gulp-eslint')
const tsProject = ts.createProject('tsconfig.json')

export type Done = (error?: any) => void

export interface WeappCliConfig {
  path: {
    mac: string
    win: string
  }
  args: string[]
  'compile-condition': {
    pathName: string
    query: string
  }
}

export interface WeappConfig {
  rootPath: string
  tsSrc: string
  srcPath: string
  stylusPath: string
  templatePath: string
  weappCliConfig: WeappCliConfig
}

export class Weapp {
  readonly rootPath: string
  readonly tsSrc: string
  readonly srcPath: string
  readonly stylusPath: string
  readonly templatePath: string
  readonly weappCliConfig: WeappCliConfig
  public platform: 'mac' | 'win' | ''

  constructor(config: WeappConfig) {
    const { rootPath, tsSrc, srcPath, stylusPath, templatePath, weappCliConfig } = config
    this.rootPath = rootPath
    this.tsSrc = tsSrc
    this.srcPath = srcPath
    this.stylusPath = stylusPath
    this.templatePath = templatePath
    this.weappCliConfig = weappCliConfig

    this.platform = os.platform() === 'darwin' ? 'mac' : os.platform() === 'win32' ? 'win' : ''
    this.init()
  }

  init() {
    gulp.task("project:env", (done: Done) => {
      const { isProd, version } = require('../src/config').default
      const env = isProd ? '生产环境' : '测试环境'
      console.log(chalk.green(`[编译结果] ${env} ${version}`))
      done()
    })
    this.createBuild()
    this.createWatch()
    this.createWeappCmd()

    gulp.task("default", gulp.parallel('build:styl', 'build:ts'))
    gulp.task('dev', gulp.series(gulp.parallel('build:styl', 'build:ts'), 'watch'))
  }

  createBuild() {
    gulp.task("build:styl", () => {
      return gulp.src(this.stylusPath, { base: '' })
        .pipe(stylus())
        .pipe(
          postcss([
            autoprefixer({
              browsers: [
                '> 1%',
                'last 2 versions'
              ]
            })
          ])
        )
        .pipe(
          rename(path => {
            path.extname = '.wxss'
          })
        )
        .pipe(gulp.dest(this.srcPath))
    })
    gulp.task("build:ts", () => {
      return gulp.src(this.tsSrc, { base: '' })
        .pipe(cache('build:ts'))
        .pipe(remember('build:ts'))
        .pipe(eslint({ fix: true }))
        .pipe(eslint.format())
        .pipe(gulpIf(isFixed, gulp.dest(this.srcPath) ))
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(this.srcPath))
    })
  }

  createWatch() {
    gulp.task("watch", (done: Done) => {
      const tsWatcher = gulp.watch(this.tsSrc, gulp.series('build:ts'))
      const stylusWatcher = gulp.watch(this.stylusPath, gulp.series('build:styl'))
      ;['unlink'].forEach(event => {
        tsWatcher.on(event, (filename: string) => {
          log.info(`Starting ${chalk.cyan("'delete:ts'")} ${chalk.magenta(filename || '')}`)
          const _filename = filename
            .replace('.ts', '.js')
          fs.remove(_filename, () => {
            log.info(`Finished ${chalk.cyan("'delete:ts'")}`)
          })
          delete (cache.caches['build:ts'] as any)[filename]
          remember.forget('build:ts', filename)
        })
        stylusWatcher.on(event, (filename: string) => {
          log.info(`Starting ${chalk.cyan("'delete:styl'")} ${chalk.magenta(filename || '')}`)
          const _filename = filename
            .replace('.styl', '.wxss')
          fs.remove(_filename, () => {
            log.info(`Finished ${chalk.cyan("'delete:styl'")}`)
          })
        })
      })
      done()
    })
  }

  addPathToAppJson(pagePath: string) {
    fs.readFile(`${this.srcPath}/app.json`, (err, data) => {
      if (err) {
        return console.error(err)
      }
      const dataJson = JSON.parse(data.toString())
      dataJson.pages.push(pagePath)
      const str = JSON.stringify(dataJson, null, 2)
      fs.writeFile(`${this.srcPath}/app.json`, str, (err) => {
        if (err) {
          console.error(err)
        }
      })
    })
  }

  weappCommand(argsList: string[]) {
    if (!this.platform || !this.weappCliConfig.path[this.platform]) return

    const cli = this.weappCliConfig.path[this.platform]
  
    const cliback = child_process.spawn(cli, argsList)
    console.log(chalk.green(`[执行脚本] ${cli} ${argsList.join(' ')}`))
    cliback.stdout.on('data', (data) => {
      let lines = data.toString().split(/[\n|\r\n]/).filter((i: any) => i)
      let contents = lines.join('\r\n')
      console.log(chalk.cyan(contents))
    })
    cliback.stderr.on('data', (data) => {
      let lines = data.toString().split(/[\n|\r\n]/).filter((i: any) => i)
      let contents = lines.join('\r\n')
      console.log(chalk.red(contents))
    })
  }

  weappBuild() {
    const params = minimist(process.argv.slice(2), {
      boolean: this.weappCliConfig.args
    })

    const needBuildList = ['o', 'open', 'u', 'upload']
    let returnVal: undefined | Undertaker.TaskFunction
    needBuildList.forEach(item => {
      if (!returnVal && params[item]) {
        returnVal = gulp.series(gulp.parallel('build:styl', 'build:ts'), 'project:env')
      }
    })
    return returnVal || gulp.series('project:env')
  }

  createWeappCmd() {
    gulp.task("page", (done: Done) => {
      const options = minimist(process.argv.slice(2), {
        string: ['name', 'path']
      })
      const { name, path: parentPath } = options
    
      const destPath = parentPath ? `${parentPath}/${name}` : `${name}`
    
      const templatepPagePath = path.resolve(this.templatePath, 'page/*.*')
      gulp.src(templatepPagePath)
        .pipe(rename(path => {
          path.basename = name
        }))
        .pipe(
          gulp.dest(`${this.srcPath}/pages/${destPath}/`)
        )
      this.addPathToAppJson(path.join(`pages/${destPath}/${name}`))
      done()
    })
    gulp.task("comp", (done: Done) => {
      const options = minimist(process.argv.slice(2), {
        string: ['name', 'path']
      })
      const { name, path: parentPath } = options
    
      const destPath = parentPath ? `${parentPath}/${name}` : `${name}`
    
      const templatepPagePath = path.resolve(this.templatePath, 'component/*.*')
      gulp.src(templatepPagePath)
        .pipe(rename(path => {
          path.basename = name
        }))
        .pipe(
          gulp.dest(`${this.srcPath}/components/${destPath}/`)
        )
      done()
    })

    gulp.task("weapp:exec", (done: Done) => {
      const params = minimist(process.argv.slice(2), {
        string: this.weappCliConfig.args,
      })
      delete params._

      interface ArgvOptions {
        [arg: string]: string
      }
      let argvOptions: ArgvOptions = {}
      for (let key in params) {
        const argv = key.length > 1 ? `--${key}` : `-${key}`
    
        switch (key) {
          case 'l' || 'login': // 登录
            argvOptions[argv] = this.rootPath
            break
          case 'o' || 'open': // 打开项目
            argvOptions[argv] = this.rootPath
            break
          case 'p' || 'preview': // 预览
            argvOptions[argv] = this.rootPath
            break
          case 'auto-preview': // 提交后自动预览
            argvOptions[argv] = this.rootPath
            break
          case 'cp':
            argvOptions['-p'] = this.rootPath // 自定义预览
            const customPreview = this.weappCliConfig['compile-condition']
            customPreview && (argvOptions['--compile-condition'] = JSON.stringify(customPreview))
            break
          case 'u' || 'upload': // 上传
            const { isProd, version, versionDesc } = require('../src/config').default
            const env = isProd ? '生产环境' : '测试环境'
            const desc = versionDesc ? `${env}: ${versionDesc}` : `${env}: ${getNowTime()} 上传`
    
            argvOptions[argv] = params[key] || `${version}@${this.rootPath}`
            argvOptions['--upload-desc'] = desc
            argvOptions['--upload-info-output'] = path.resolve(this.rootPath, 'upload.info.json')
            break
          case 'close': // 关闭项目窗口
            argvOptions[argv] = this.rootPath
            break
          case 'quit': // 退出开发者工具
            argvOptions[argv] = ''
            break
          default:
        }
      }
    
      const argvList = []
      for (let key in argvOptions) {
        argvList.push(key, argvOptions[key])
      }
      this.weappCommand(argvList)
      done()
    })

    gulp.task("weapp:cli", gulp.series(this.weappBuild(), 'weapp:exec'))
  }
}
