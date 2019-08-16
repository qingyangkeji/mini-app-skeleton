interface IDataType {
  /** 日志 */
  logs: string[]
}
interface ICustomOption {
  /** 获取日志 */
  getLogs(): string[]
}


Page<IDataType, ICustomOption>({
  data: {
    logs: []
  },
  getLogs() {
    return wx.getStorageSync('logs') || []
  },
  onLoad() {
    this.setData({
      logs: this.getLogs()
    })
  }
})
