declare namespace WechatMiniprogram {
  namespace App {
    interface Constructor {
      Page: WechatMiniprogram.Page.Constructor
    }
  }
}

declare namespace Store {
  namespace Page {
    type DataOptions = {
      $state: IAnyObject
    }
    type CustomeOptions = {
      useStore: boolean
      useProp: string[]
    }
  }

  type TPageLife = 
    | 'onLoad'
    | 'onShow'
    | 'onReady'
    | 'onHide'
    | 'onUnload'
    | 'onPullDownRefresh'
    | 'onReachBottom'
    | 'onShareAppMessage'
    | 'onPageScroll'
    | 'onTabItemTap'

  type IAnyObject = Record<string, any>

  type TOptions =  {
    /** 全局状态 */
    state: IAnyObject
    /** 全局方法 */
    methods: Record<string, Function>
    /** 在执行页面中周期事件时，将先执行pageLisnner，再执行原页面周期内事件 */
    pageLisener: Partial<Record<TPageLife, Function>>
    /** 是否开启局部模式，默认为false; 当我们想规定只有某些页面和组件使用$state时，就需开启此模式，设置为true。 */
    openPart: boolean
    /** Page、Component防改写 */
    nonWritable: boolean
  }

  interface StoreInstance {
    /** 状态 */
    $state: TOptions['state']
    /** 页面+组件树 */
    $r: any[]
  }
}
