// logs.js
import { formatTime } from '../../utils/util'

interface DataType {
  /** 日志 */
  logs: string[]
}
interface CustomOption {
  /** 获取日志 */
  getLogs(): string[]
}


Page<DataType, CustomOption>({
  data: {
    logs: []
  },
  getLogs() {
    return (wx.getStorageSync('logs') || []).map((log: number) => {
      return formatTime(new Date(log))
    })
  },
  onLoad() {
    this.setData({
      logs: this.getLogs()
    })

    console.log(this.data.logs)
  }
})
