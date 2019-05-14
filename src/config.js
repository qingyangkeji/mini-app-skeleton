/**
 * 小程序配置文件
 */
const isProd = false
const isMock = false

const config = {
  isProd,
  version: '1.0.0',
  versionDesc: '版本描述',
  rootUrl: isProd ? '' : isMock ? '' : '',
}

module.exports = config