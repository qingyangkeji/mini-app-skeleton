const gulp = require('gulp')
const { cleanDist, copyFilesToDist, compileStylusFiles } = require('./gulp.base')
const callfile = require('child_process')

const build = (done) => {
  gulp.series(cleanDist, copyFilesToDist, compileStylusFiles)
  done()
}

// release: 待完善
const release = (done) => {
  // '/Applications/wechatwebdevtools.app/Contents/MacOS'
  // callfile.execFile('change_password.sh',['-H', ip, '-U', username, '-P', password, '-N', newpassword],null,function (err, stdout, stderr) {
  //   callback(err, stdout, stderr)
  // })
  gulp.series(build)
  done()
}

module.exports = {
  release: gulp.series(release)
}