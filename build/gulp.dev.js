const gulp = require('gulp')

const { cleanDist, copyFilesToDist, compileStylusFiles } = require('./gulp.base')
const { copyFilePath, stylusPath } = require('./config')

const build = () => {
  return gulp.series(cleanDist, copyFilesToDist, compileStylusFiles)
}

const watchs = done => {
	gulp.watch(copyFilePath, gulp.series(copyFilesToDist))
  gulp.watch(stylusPath, gulp.series(compileStylusFiles))
	done()
}

module.exports = {
  develop: gulp.series(build(), watchs)
}