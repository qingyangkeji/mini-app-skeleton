const { createPage, createComponent } = require('./build/gulp.base')
const { develop } = require('./build/gulp.dev')
const { release } = require('./build/gulp.release')

module.exports = {
	page: createPage,
	comp: createComponent,
	dev: develop,
	release: release,
	default: develop
}