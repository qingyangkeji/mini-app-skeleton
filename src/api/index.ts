import { request } from './request'

export default {
  /** 登录 */
  login(params: Api.login.IParams, reqConfig?: IReqConfig) {
    return request<Api.login.IResponse>('POST', `/login`, params, reqConfig)
  },
  /** 获取用户信息 */
  getUserInfo(params: Api.Base.IParams, reqConfig?: IReqConfig) {
    return request<Api.Base.IResponse>('GET', `/userinfo`, params, reqConfig)
  },
}