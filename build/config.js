
const path = require('path')

const srcPath = path.resolve(__dirname, '../src')
const extArr = ['.js', '.json', '.png', '.jpg', '.wxss', '.wxml', '.wxs']
const copyFilePath = extArr.reduce((arr, ext) => {
  arr.push(`${srcPath}/**/*${ext}`);
  return arr
}, [])

module.exports = {
  srcPath,
  extArr,
  copyFilePath,
  stylusPath: path.resolve(__dirname, 'src/**/*.styl'),
  distPath: path.resolve(__dirname, '../dist'),
  wechatwebdevtoolsPath: {
    mac: '/Applications/wechatwebdevtools.app/Contents/MacOS'
  },
}