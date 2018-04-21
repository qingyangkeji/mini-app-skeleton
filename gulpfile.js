const gulp = require('gulp');
const del = require('del');
const path = require('path');
const fs = require('fs-extra');
const stylus = require('gulp-stylus');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssClean = require('postcss-clean');
const postCssUrl = require('postcss-url');
const rename = require('gulp-rename');
const minimist = require('minimist');

const srcPath = path.resolve(__dirname, 'src');
const stylusPath = path.resolve(__dirname, 'src/**/*.styl');
const extArr = ['.js', '.json', '.png', '.wxss', '.wxml', '.wxs'];
const copyFilePath = extArr.reduce((arr,ext) => {
	arr.push(`${srcPath}/**/*${ext}`);
	return arr;
}, []);

const distPath = path.resolve(__dirname, 'dist');

gulp.task('copy', function () {
	fs.copySync(srcPath, distPath, {
		filter: (src, dest) => {
			const extname = path.extname(src);

			// 可以被copy的文件  ''表示文件夹 待优化
			const copyExtArr = [''].concat(extArr);

			return copyExtArr.includes(extname);
		}
	})
});

gulp.task('compile-stylus', ['copy'], function () {
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
		);
});

gulp.task('develop', ['copy', 'compile-stylus'], function() {
	gulp.watch(copyFilePath, ['copy']);
	gulp.watch(stylusPath, ['compile-stylus'])
})

gulp.task('clean', function() {
    return del([distPath]).then(function() {
        gulp.start('develop')
    })
});

gulp.task('default', function() {
    gulp.start('clean')
});

// TODO
gulp.task('build', function() {

})



gulp.task('page', function() {

	const cliOptions = {
		string: 'name'
	}
	const options = minimist(process.argv.slice(2), cliOptions);
	const { name } = options;

	const templatePath = path.resolve(__dirname, 'template/page/*.*');;
	gulp.src(templatePath)
		.pipe(rename(path => {
			path.basename = name;
		}))
		.pipe(
			gulp.dest(`${srcPath}/pages/${name}/`)
		)
})

gulp.task('comp', function() {

	const cliOptions = {
		string: 'name'
	}
	const options = minimist(process.argv.slice(2), cliOptions);
	const { name } = options;

	const templatePath = path.resolve(__dirname, 'template/component/*.*');;
	gulp.src(templatePath)
		.pipe(rename(path => {
			path.basename = name;
		}))
		.pipe(
			gulp.dest(`${srcPath}/component/${name}/`)
		)
})
