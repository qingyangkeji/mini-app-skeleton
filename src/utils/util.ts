import config from '../config'
const { tabBarUrlList } = config

/** 是否以某个片段字符串开头 */
const isStartWith = (string: string, str: string): boolean => {
  return string.slice(0, str.length) === str
}

/** 格式化小程序url */
const formatPagesUrl = (url: string): string => {
  return isStartWith(url, '/pages') ? url : isStartWith(url, 'pages') ? `/${url}` : ''
}

/** 页面跳转，合并处理switchTab和navigateTo */
const navigateTo = (url: string, params?: IAnyObject): void => {
  let paramsStr = ''
  url = formatPagesUrl(url)
  if (params && tabBarUrlList.indexOf(url) === -1) {
    paramsStr = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
    url += `?${paramsStr}`
  }
  switch (true) {
    case tabBarUrlList.indexOf(url) > -1:
      wx.switchTab({ url })
    break

    default:
      wx.navigateTo({ url })
  }
}

export {
  isStartWith,
  formatPagesUrl,
  navigateTo
}