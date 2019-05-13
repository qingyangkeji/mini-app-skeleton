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
const extArr = ['.js', '.json', '.png', '.jpg', '.wxss', '.wxml', '.wxs'];
const copyFilePath = extArr.reduce((arr,ext) => {
	arr.push(`${srcPath}/**/*${ext}`);
	return arr;
}, []);
const distPath = path.resolve(__dirname, 'dist')

// 清空dist
const clean = () => {
	return del([distPath])
}

// 复制文件
const copy = done => {
	fs.copySync(srcPath, distPath, {
		filter: (src, dest) => {
			const extname = path.extname(src);

			// 可以被copy的文件  ''表示文件夹 待优化
			const copyExtArr = [''].concat(extArr);

			return copyExtArr.includes(extname);
		}
	})
	done()
}

// 编译stylus文件
const compileStylus = () => {
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
const writeAppJson = (params) => {
	fs.readFile(`${srcPath}/app.json`, function(err, data){
		if (err){
				return console.error(err)
		}
		const dataJson = JSON.parse(data.toString())
		dataJson.pages.push(params)
		const str = JSON.stringify(dataJson, null, 2)
		fs.writeFile(`${srcPath}/app.json`, str, function(err){
				if(err){
						console.error(err)
				}
		})
	})
}

// 监听
const watchs = done => {
	gulp.watch(copyFilePath, gulp.series(copy))
	gulp.watch(stylusPath, gulp.series(compileStylus))
	done()
}

// 新建页面
const page = (done) => {
	const cliOptions = {
		string: 'name',
		string: 'path'
	}
	const options = minimist(process.argv.slice(2), cliOptions);
	const { name, path: parntPath } = options;

	const destPath = parntPath ? `${parntPath}/${name}` : `${name}`

	const templatePath = path.resolve(__dirname, 'template/page/*.*');;
	gulp.src(templatePath)
		.pipe(rename(path => {
			path.basename = name;
		}))
		.pipe(
			gulp.dest(`${srcPath}/pages/${destPath}/`)
		)
	writeAppJson(`pages/${destPath}/${name}`)
	done()
}

// 新建组件
const comp = (done) => {
	const cliOptions = {
		string: 'name',
		string: 'path'
	}
	const options = minimist(process.argv.slice(2), cliOptions);
	const { name, path: parntPath } = options;

	const destPath = parntPath ? `${parntPath}/${name}` : `${name}`

	const templatePath = path.resolve(__dirname, 'template/component/*.*');;
	gulp.src(templatePath)
		.pipe(rename(path => {
			path.basename = name;
		}))
		.pipe(
			gulp.dest(`${srcPath}/component/${destPath}/`)
		)
	done()
}

// develop: 开发
const dev = () => {
	return gulp.series(clean, copy, compileStylus, watchs)
}

// release: 上传
const release = () => {}

exports.page = gulp.series(page)
exports.comp = gulp.series(comp)
exports.dev = dev()
exports.release = release()
exports.default = dev()