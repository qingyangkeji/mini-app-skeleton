const { createPage, createComponent, build, wechatwebdevtoolscli } = require('./build/gulp.base')
const { develop } = require('./build/gulp.dev')

module.exports = {
  page: createPage,
  comp: createComponent,
  wechat: wechatwebdevtoolscli,
  dev: develop,
  default: build()
}