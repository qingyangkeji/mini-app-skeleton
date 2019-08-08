import { request, ReqConfig } from './request'

export default {
  /** 登录 */
  login(params: Api.login.params, reqConfig?: ReqConfig) {
    return request<Api.login.response>('POST', `/self_logistics/login`, params, reqConfig)
  },
}