/**
 * 小程序配置文件
 */
const isProd = false
const isMock = false

const config = {
  version: '1.0.0',
  rootUrl: isProd ? '' : isMock ? '' : '',
};

module.exports = config;