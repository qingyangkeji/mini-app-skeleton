
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
  wechatwebdevtools: {
    path: {
      mac: '/Applications/wechatwebdevtools.app/Contents/MacOS',
      win: ''
    },
    args: [
      'l', 'login',  // 登录
      'o', 'open',  // 打开项目
      'p', 'preview',  // 预览 & 自定义预览
      'auto-preview',  // 提交后自动预览
      'u', 'upload', 'desc', 'upload-desc',  // 上传
      'close',  // 关闭项目窗口
      'quit',  // 退出开发者工具
    ],
    // 配置自定义预览页面 路径&参数
    'compile-condition': {
      pathName: "pages/index/index",
      query: ""
    }
  },
}