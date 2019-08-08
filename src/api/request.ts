import config from '../config'
  
export interface ReqConfig {
  showToast?: boolean
  contentType?: string
  loadingTitle?: string
}

interface SuccessRes<R> {
  /** 开发者服务器返回的数据 */
  data: {
    data: R
    message: string
    status: number
  }
  /** 开发者服务器返回的 HTTP Response Header */
  header: object
  /** 开发者服务器返回的 HTTP 状态码 */
  statusCode: number
  errMsg: string
}

interface FailRes {
  errMsg: string
}

/**+
 * request请求封装
 * @param method 请求类型
 * @param url 请求地址
 * @param params 请求参数
 * @param reqConfig 请求配置
 */
export function request<R>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, params = {}, reqConfig?: ReqConfig) {
  const { showToast = true, contentType = 'application/json', loadingTitle = '' } = reqConfig || {}

  const token = wx.getStorageSync('token') || ''
  const env = wx.getStorageSync('env')
  if (config.env !== env) {
    wx.removeStorageSync('token')
    wx.setStorageSync('env', config.env)
  }

  return new Promise<Pick<SuccessRes<R>,'data'>["data"] >((resolve, reject) => {
    showToast && wx.showLoading({
      title: loadingTitle || '加载中'
    })

    wx.request({
      url: config.rootUrl + url,
      data: params,
      header: {
        'content-type': contentType,
        'Authorization': `Bearer ${token}`
      },
      method: method,
      success: (res: SuccessRes<R>) => {
        showToast && wx.hideLoading()
        const { data } = res
        if (data.status === 200) {
          resolve(data)
        } else if (data.status === 401) {
          // 登录
          resolve(data)
        } else {
          showToast && (
            wx.showToast({
              icon: 'none',
              title: data.message
            })
          )
          reject(data)
        }
      },
      fail: (err: FailRes) => {
        console.log('request fail:', err)
        if (err.errMsg && err.errMsg.indexOf('request:fail') > -1) {
          // setTimeout(() => {
          //   resolve(request(method, url, params, reqConfig))
          // }, 100)
        } else {
          showToast && wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: err.errMsg
          })
          reject(err)
        }
      }
    })
  })
}
