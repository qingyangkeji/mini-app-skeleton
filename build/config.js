
const path = require('path')

const srcPath = path.resolve(__dirname, '../src')
const allowCopyExtList = ['.js', '.json', '.png', '.jpg', '.wxss', '.wxml', '.wxs']
const copyFilePath = allowCopyExtList.reduce((arr, ext) => {
  arr.push(`${srcPath}/**/*${ext}`)
  return arr
}, [])

module.exports = {
  srcPath,
  allowCopyExtList,
  copyFilePath,
  stylusPath: path.resolve(__dirname, '../src/**/*.styl'),
  distPath: path.resolve(__dirname, '../dist'),
  templatePath: path.resolve(__dirname, '../template'),
  wechatwebdevtoolsPath: {
    mac: '/Applications/wechatwebdevtools.app/Contents/MacOS'
  },
}