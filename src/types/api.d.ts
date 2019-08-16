/** Api接口的参数结构和响应结构 */
declare namespace Api {
  /** 登录 */
  namespace login {
    interface IParams {
      username: string;
      password: string;
    }
    interface IResponse extends IRes {
      data: {
        token: string;
        userInfo: IAnyObject;
      };
    }
  }

  /** 兼容js */
  namespace Base {
    type IParams = any;
    type IResponse = any;
  }
}
