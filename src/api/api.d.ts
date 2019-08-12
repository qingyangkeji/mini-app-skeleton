declare namespace Api {
  namespace login {
    interface IParams {
      username: string
      password: string
    }
    interface IResponse {
      name: string
      age: number
      openId: string
    }
  }
}