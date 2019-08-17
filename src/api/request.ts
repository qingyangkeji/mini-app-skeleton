import config from '../config'

/** Request请求封装 */
export function request<R extends IRes>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, params = {}, reqConfig?: IReqConfig): Promise<R> {
  const { showLoading = true, showToast = true, contentType = 'application/json', loadingTitle = '' } = reqConfig || {}

  const token = wx.getStorageSync('token') || ''
  const env = wx.getStorageSync('env')
  if (config.env !== env) {
    wx.removeStorageSync('token')
    wx.setStorageSync('env', config.env)
  }

  return new Promise<R>((resolve, reject) => {
    showLoading && wx.showLoading({
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
      success: (res: ISuccessRes<R>) => {
        showLoading && wx.hideLoading()
        const { data } = res
        if (data.status === 200) {
          resolve(data)
        } else if (data.status === 401) {
          // 跳转到登录界面 / 登录
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
      fail: (err: IFailRes) => {
        console.log('request fail:', err)
        if (err.errMsg && err.errMsg.indexOf('request:fail') > -1) {
          setTimeout(() => {
            resolve(request(method, url, params, reqConfig))
          }, 100)
        } else {
          showLoading && wx.hideLoading()
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
