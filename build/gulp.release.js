const gulp = require('gulp')
const { cleanDist, copyFilesToDist, compileStylusFiles } = require('./gulp.base')

const build = () => {
 return gulp.series(cleanDist, copyFilesToDist, compileStylusFiles)
}

// release: 待完善
const release = (done) => {
  gulp.series(build())
  done()
}


module.exports = {
  release: gulp.series(release)
}