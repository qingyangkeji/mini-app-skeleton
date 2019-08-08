declare namespace Api {
  namespace login {
    interface params {
      username: string
      password: string
    }
    interface response {
      name: string
      age: number
      openId: string
    }
  }
}