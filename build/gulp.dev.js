const path = require('path')
const gulp = require('gulp')
const fs = require('fs-extra')
const chalk = require('chalk')
const eslint = require('gulp-eslint')
const through = require('through2')
const dayjs = require('dayjs')
const gulpIf = require('gulp-if')

const { build, compileStylusFiles } = require('./gulp.base')
const { allowCopyExtList, stylusPath, distPath } = require('./config')

function isFixed(file) {
  return file.eslint != null && file.eslint.fixed
}

function NoError(file) {
  return file.eslint != null && file.eslint.errorCount === 0
}

const pipeFunc = (callback) => {
  return through.obj(function (file, enc, cb) {
    callback && callback(file)
    this.push(file)
    return cb()
  })
}

const operateFile = (_type, _path) => {
  const _relativePath = path.relative(__dirname, _path).split(path.sep).join('/')
  const _projectPath = _relativePath.replace(/^(..\/)*src\//g, '')
  const _distPath = path.join(distPath, _projectPath)
  const _allowCopyExtList = [''].concat(allowCopyExtList)
  const extname = path.extname(_path) // 扩展名，目录为 ''
  if (_allowCopyExtList.includes(extname)) {
    let color = 'green'
    if (_type === 'delete') {
      fs.removeSync(_distPath)
      color = 'red'
      console.log(chalk[color](`[${dayjs().format('HH:mm:ss')}] /dist/${_projectPath} was ${_type}`))
    } else {
      if (_type === 'add') color = 'blue'
      if (extname === '.js') {
        gulp.src(_path)
          .pipe(eslint({ fix: true }))
          .pipe(eslint.format())
          .pipe(gulpIf(isFixed, gulp.dest(path.dirname(_path))))
          .pipe(gulpIf(NoError,
            pipeFunc(() => {
              fs.copySync(_path, _distPath)
              console.log(chalk[color](`[${dayjs().format('HH:mm:ss')}] /dist/${_projectPath} was ${_type}`))
            })
          ))
      } else {
        fs.copySync(_path, _distPath)
        console.log(chalk[color](`[${dayjs().format('HH:mm:ss')}] /dist/${_projectPath} was ${_type}`))
      }
    }
  }
}
const watchs = done => {
  const _stylusPath = stylusPath.split(path.sep).join('/')
  gulp.watch(_stylusPath, gulp.series(compileStylusFiles))
  const copyFilePathWatcher = gulp.watch(path.resolve(__dirname, '../src'))

  copyFilePathWatcher.on('change', (_path) => {
    operateFile('update', _path)
  })
  copyFilePathWatcher.on('addDir', (_path) => {
    operateFile('add', _path)
  })
  copyFilePathWatcher.on('add', (_path) => {
    operateFile('add', _path)
  })
  copyFilePathWatcher.on('unlinkDir', (_path) => {
    operateFile('delete', _path)
  })
  copyFilePathWatcher.on('unlink', (_path) => {
    operateFile('delete', _path)
  })
  done()
}

module.exports = {
  develop: gulp.series(build(), watchs)
}
