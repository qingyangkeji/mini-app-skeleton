import { request, IReqConfig } from './request'

export default {
  /** 登录 */
  login(params: Api.login.IParams, reqConfig?: IReqConfig) {
    return request<Api.login.IResponse>('POST', `/self_logistics/login`, params, reqConfig)
  },
}