declare namespace event {
  interface ITarget {
    /** 事件组件的id */
    id: string
    /** 当前组件的类型 */
    tagName?: string
    /** 事件组件上由data-开头的自定义属性组成的集合 */
    dataset: Record<string, any>
    /** 距离页面顶部的偏移量 */
    offsetTop: number
    /** 距离页面左边的偏移量 */
    offsetLeft: number
  }

  /**
   * base事件参数
   */
  interface IBase {
    /** 事件类型 */
    type: string
    /** 页面打开到触发事件所经过的毫秒数 */
    timeStamp: number
    /** 触发事件的源组件 */
    target: ITarget
    /** 事件绑定的当前组件 */
    currentTarget: ITarget
  }

  /**
   * 自定义事件
   */
  interface ICustom<P extends Record<string, any> = Record<string, any>> extends IBase {
    /** 额外的信息 */
    detail: P
  }

  /**
   * 键盘输入时触发，event.detail = {value, cursor, keyCode}，处理函数可以直接 return 一个字符串，将替换输入框的内容。
   */
  type Input = ICustom<{
    /** 输入框内容 */
    value: string
    /** 光标位置 */
    cursor: number
    /** keyCode 为键值 (目前工具还不支持返回keyCode参数) `2.1.0` 起支持 */
    keyCode?: number
  }>

  /**
   * 输入框聚焦时触发，event.detail = { value, height }
   */
  type InputFocus = ICustom<{
    /** 输入框内容 */
    value: string
    /** 键盘高度, 在基础库 `1.9.90` 起支持 */
    height?: number
  }>

  /**
   * 输入框失去焦点时触发，event.detail = {value: value}
   */
  type InputBlur = ICustom<{
      /** 输入框内容 */
      value: string
  }>

  /**
   * 点击完成按钮时触发，event.detail = {value: value}
   */
  type InputConfirm = ICustom<{
      /** 输入框内容 */
      value: string
  }>

  /**
   * 键盘高度发生变化的时候触发此事件，event.detail = {height: height, duration: duration}
   *
   * __tip__: 键盘高度发生变化，keyboardheightchange事件可能会多次触发，开发者对于相同的height值应该忽略掉
   *
   * 最低基础库: `2.7.0`
   */
  type InputKeyboardHeightChange = ICustom<{
      /** 键盘高度 */
      height: number
      duration: number
  }>
}
