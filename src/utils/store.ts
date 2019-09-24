type TPage = WechatMiniprogram.Page.Constructor
type TComponent = WechatMiniprogram.Component.Constructor

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

export type TOptions =  {
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

export interface StoreInstance {
  /** 状态 */
  $state: TOptions['state']
  /** 页面+组件树 */
  $r: any[]
}

const Version = '1.2.7'

export default class Store {
  /** 状态 */
  public readonly $state: TOptions['state']
  /** 页面+组件树 */
  private readonly $r: any[]
  private readonly openPart: TOptions['openPart']
  private readonly methods: TOptions['methods']
  private readonly pageLisener: TOptions['pageLisener']
  private readonly nonWritable: TOptions['nonWritable']
  private readonly originPage: TPage
  private readonly originComponent: TComponent
  private readonly pageLife: TPageLife[] = [
    'onLoad',
    'onShow',
    'onReady',
    'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onShareAppMessage',
    'onPageScroll',
    'onTabItemTap'
  ]
  constructor({ state = {}, openPart = false, methods = {}, pageLisener = {}, nonWritable = false }: TOptions) {
    this.openPart = openPart
    this.methods = methods
    this.pageLisener = pageLisener
    this.nonWritable = nonWritable
    this.originPage = Page
    this.originComponent = Component

    // 状态初始化
    this.$state = {}
    if (utils.isObject(state)) {
      this.$state = utils.deepClone(state)
    }
    // 页面+组件树
    this.$r = []
  }
  /** 创建时，添加组件 */
  private create(r: any, o: any = {}) {
    r.$store = {}
    const { useProp } = o
    if (o.hasOwnProperty('useProp')) {
      if (useProp && (utils.isString(useProp) || utils.isArray(useProp))) {
        r.$store.useProp = [].concat(useProp)
      } else {
        r.$store.useProp = []
      }
    }
    
    r.$store.useStore = this.canUseStore(o)
    if (this.canUseStore(o)) {
      this.$r.push(r)
      if (r.$store.useProp) {
        r.setData({
          $state: utils.filterKey(this.$state, r.$store.useProp, (key, usekey) => key === usekey)
        })
      } else {
        r.setData({
          $state: this.$state
        })
      }
    }
  }
  /** Store是否可用 */
  private canUseStore (o: any = {}) {
    return (this.openPart === true && o.useStore === true) || !this.openPart
  }
  /** 销毁时，移除组件 */
  private destroy(r: any) {
    let index = this.$r.findIndex(item => item === r)
    if (index > -1) {
      this.$r.splice(index, 1)
    }
  }
}

const utils = {
  _typeof(o: any) {
    return Object.prototype.toString.call(o).slice(8, -1).toLowerCase()
  },
  isString(o: any) {
    return this._typeof(o) === 'string'
  },
  isNumber(o: any) {
    return this._typeof(o) === 'number'
  },
  isArray(o: any) {
    return this._typeof(o) === 'array'
  },
  isObject(o: any) {
    return this._typeof(o) === 'object'
  },
  isNull(o: any) {
    return this._typeof(o) === 'null'
  },
  isUndefined(o: any) {
    return this._typeof(o) === 'undefined'
  },
  deepClone(o: object | Array<any>) {
    return JSON.parse(JSON.stringify(o))
  },
  /** filterObjectByKeys */
  filterKey(obj: IAnyObject, useKeys: string[] = [], fn: (key: string, usekey: string) => boolean) {
    const result: IAnyObject = {}
    Object.keys(obj)
      .filter(key => useKeys.some(usekey => fn(key, usekey)))
      .forEach(key => {
        result[key] = obj[key]
      })
    return result
  }
}