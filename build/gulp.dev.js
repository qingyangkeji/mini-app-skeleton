const gulp = require('gulp')

const { build, copyFilesToDist, compileStylusFiles } = require('./gulp.base')
const { copyFilePath, stylusPath } = require('./config')

const watchs = done => {
  gulp.watch(copyFilePath, gulp.series(copyFilesToDist))
  gulp.watch(stylusPath, gulp.series(compileStylusFiles))
  done()
}

module.exports = {
  develop: gulp.series(build(), watchs)
}