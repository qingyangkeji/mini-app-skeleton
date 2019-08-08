/**
 * 小程序配置文件
 */
const isProd = false
const isMock = false

const config = {
  isProd,
  version: '1.0.0',
  versionDesc: '',
  env: isProd ? 'pro' : 'dev',
  rootUrl: isProd ? '' : isMock ? '' : ''
}

export default config
