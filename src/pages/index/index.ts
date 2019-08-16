import api from '../../api/index'

interface IDataType {
  /** 用户信息 */
  userInfo: IAnyObject | null
}
interface ICustomOption {
  /** 登录 */
  login(): void
}

Page<IDataType, ICustomOption>({
  data: {
    userInfo: null
  },
  login() {
    const params: Api.login.IParams = {
      username: 'qingyangkeji',
      password: '123456'
    }
    api.login(params, { showLoading: false }).then(({ data, message }: Api.login.IResponse) => {
      wx.showToast({
        icon: 'none',
        title: message,
        duration: 1500
      })
      wx.setStorageSync('token', data.token)
      this.setData({
        userInfo: data.userInfo
      })
    }).catch(err => {
      console.error(err)
    })
  },

  onLoad() {
    this.login()
  }
})
