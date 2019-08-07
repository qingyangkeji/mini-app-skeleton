const gulp = require('gulp')
const path = require('path')
const fs = require('fs-extra')
const stylus = require('gulp-stylus')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssClean = require('postcss-clean')
const postCssUrl = require('postcss-url')
const rename = require('gulp-rename')
const minimist = require('minimist')
const child_process = require('child_process')
const os = require('os')
const dayjs = require('dayjs')
const chalk = require('chalk')
const { srcPath, copyFilePath, stylusPath, rootPath, distPath, templatePath, wechatwebdevtools } = require('./config')
const platform = os.platform() === 'darwin' ? 'mac' : os.platform() === 'win32' ? 'win' : ''

// 清空dist
const cleanDist = (done) => {
  fs.emptyDirSync(distPath) // 移除del包，改用emptyDirSync
  done()
}

// 复制文件
const copyFilesToDist = () => {
  return gulp.src(copyFilePath)
    .pipe(gulp.dest(distPath))
}

// 编译stylus文件
const compileStylusFiles = () => {
  return gulp.src(stylusPath)
    .pipe(stylus())
    .pipe(
      postcss([
        postCssUrl({
          url: 'inline'
        }),
        autoprefixer({
          browsers: [
            '> 1%',
            'last 2 versions'
          ]
        }),
        cssClean()
      ])
    )
    .pipe(
      rename(path => {
        path.extname = '.wxss'
      })
    )
    .pipe(
      gulp.dest(distPath)
    )
}

// 修改app.json
const _addPathToAppJson = (params) => {
  fs.readFile(`${srcPath}/app.json`, function (err, data) {
    if (err) {
      return console.error(err)
    }
    const dataJson = JSON.parse(data.toString())
    dataJson.pages.push(params)
    const str = JSON.stringify(dataJson, null, 2)
    fs.writeFile(`${srcPath}/app.json`, str, function (err) {
      if (err) {
        console.error(err)
      }
    })
  })
}

// 获取dist环境
const getDistEnv = (done) => {
  const { isProd, version } = require('../dist/config')
  const env = isProd ? '生产环境' : '测试环境'
  console.log(chalk.green(`[dist环境] ${env} ${version}`))
  done()
}

// 编译
const build = () => {
  return gulp.series(cleanDist, copyFilesToDist, compileStylusFiles, getDistEnv)
}

const wechatBuild = () => {
  const params = minimist(process.argv.slice(2), {
    boolean: wechatwebdevtools.args
  })

  const needBuildList = ['o', 'open', 'u', 'upload']
  let returnVal
  needBuildList.forEach(item => {
    if (!returnVal && params[item]) {
      returnVal = build()
    }
  })
  return returnVal || gulp.series(getDistEnv)
}

// 新建页面
const createPage = (done) => {
  const options = minimist(process.argv.slice(2), {
    string: ['name', 'path']
  })
  const { name, path: parentPath } = options

  const destPath = parentPath ? `${parentPath}/${name}` : `${name}`

  const templatepPagePath = path.resolve(templatePath, 'page/*.*')
  gulp.src(templatepPagePath)
    .pipe(rename(path => {
      path.basename = name
    }))
    .pipe(
      gulp.dest(`${srcPath}/pages/${destPath}/`)
    )
  _addPathToAppJson(path.join(`pages/${destPath}/${name}`))
  done()
}

// 新建组件
const createComponent = (done) => {
  const options = minimist(process.argv.slice(2), {
    string: ['name', 'path']
  })
  const { name, path: parentPath } = options

  const destPath = parentPath ? `${parentPath}/${name}` : `${name}`

  const templatepPagePath = path.resolve(templatePath, 'component/*.*')
  gulp.src(templatepPagePath)
    .pipe(rename(path => {
      path.basename = name
    }))
    .pipe(
      gulp.dest(`${srcPath}/components/${destPath}/`)
    )
  done()
}

const wechatCommand = (argsList) => {
  if (!platform || !wechatwebdevtools.path[platform]) return

  const cli = wechatwebdevtools.path[platform]

  const cliback = child_process.spawn(cli, argsList)
  console.log(chalk.green(`[执行脚本] ${cli} ${argsList.join(' ')}`))
  cliback.stdout.on('data', (data) => {
    let lines = data.toString().split(/[\n|\r\n]/).filter(i => i)
    let contents = lines.join('\r\n')
    console.log(chalk.cyan(contents))
  })
  cliback.stderr.on('data', (data) => {
    let lines = data.toString().split(/[\n|\r\n]/).filter(i => i)
    let contents = lines.join('\r\n')
    console.log(chalk.red(contents))
  })
}

// 微信开发者工具命令行
const wechatwebdevtoolscli = (done) => {
  const params = minimist(process.argv.slice(2), {
    string: wechatwebdevtools.args
  })
  delete params._

  let argvOptions = {}
  for (let key in params) {
    const argv = key.length > 1 ? `--${key}` : `-${key}`

    switch (key) {
      case 'l' || 'login': // 登录
        argvOptions[argv] = rootPath
        break
      case 'o' || 'open': // 打开项目
        argvOptions[argv] = rootPath
        break
      case 'p' || 'preview': // 预览
        argvOptions[argv] = rootPath
        break
      case 'cp':
        argvOptions['-p'] = rootPath // 自定义预览
        const customPreview = wechatwebdevtools['compile-condition']
        customPreview && (argvOptions['--compile-condition'] = JSON.stringify(customPreview))
        break
      case 'auto-preview': // 提交后自动预览
        argvOptions[argv] = rootPath
        break
      case 'u' || 'upload': // 上传
        const { isProd, version, versionDesc } = require('../dist/config')
        const env = isProd ? '生产环境' : '测试环境'
        const desc = versionDesc ? `${env}: ${versionDesc}` : `${env}: ${dayjs().format('YYYY-MM-DD HH:mm:ss')} 上传`

        argvOptions[argv] = params[key] || `${version}@${rootPath}`
        argvOptions['--upload-desc'] = desc
        argvOptions['--upload-info-output'] = path.resolve(__dirname, '../upload.info.json')
        break
      case 'close': // 关闭项目窗口
        argvOptions[argv] = rootPath
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

  wechatCommand(argvList)
  done()
}

module.exports = {
  createPage: gulp.series(createPage),
  createComponent: gulp.series(createComponent),

  cleanDist,
  copyFilesToDist,
  compileStylusFiles,
  build,
  wechatwebdevtoolscli: gulp.series(wechatBuild(), wechatwebdevtoolscli)
}
