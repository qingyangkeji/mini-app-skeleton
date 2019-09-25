/// <reference path="./store.d.ts" />

App.Page = <TData extends WechatMiniprogram.Page.DataOption, TCustom extends WechatMiniprogram.Page.CustomOption>(
  o: WechatMiniprogram.Page.Options<TData, TCustom>
) => {
  const options: WechatMiniprogram.Page.Options<TData & Store.Page.DataOptions, TCustom & Store.Page.CustomeOptions> = {
    useStore: true,
    useProp: [],
    ...o,
    data: {
      ...o.data
    },
  }
  options.data!.$state
  Page<TData, TCustom>(options)
}

type TD = {
  hehe: string
}
type TC = {
  get(): void
}
App.Page<TD, TC>({
  data: {
    hehe: ''
  },
  get() {

  }
})

const Version = '1.2.7'

export default class Store {
  /** 状态 */
  public readonly $state: Store.TOptions['state']
  /** 页面+组件树 */
  private readonly $r: any[]
  private readonly openPart: Store.TOptions['openPart']
  private readonly methods: Store.TOptions['methods']
  private readonly pageLisener: Store.TOptions['pageLisener']
  private readonly nonWritable: Store.TOptions['nonWritable']
  private readonly originPage: WechatMiniprogram.Page.Constructor
  private readonly originComponent: WechatMiniprogram.Component.Constructor
  private readonly pageLife: Store.TPageLife[] = [
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
  constructor({ state = {}, openPart = false, methods = {}, pageLisener = {}, nonWritable = false }: Store.TOptions) {
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
    this.rewrite()
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
  private rewrite() {
    // 重写Page
    App.Page = <TData extends WechatMiniprogram.Page.DataOption, TCustom extends WechatMiniprogram.Page.CustomOption>(
      o: WechatMiniprogram.Page.Options<TData, TCustom>
    ) => {
      const options: WechatMiniprogram.Page.Options<TData & Store.Page.DataOptions, TCustom & Store.Page.CustomeOptions> = {
        useStore: true,
        useProp: [],
        ...o
      }
      const { canUseStore, methods, pageLife, create, destroy, pageLisener } = this
      if (canUseStore(options)) {
        // 状态注入
        options.data!.$state = this.$state
      }
      // 行为注入
      Object.keys(methods).forEach(key => {
        // 不能是周期事件
        if (
          typeof methods[key] === 'function' &&
          !pageLife.some(item => item === key)
        ) {
          options[key] = methods[key]
        }
      })
      // 覆盖原周期
      const originCreate = options.onLoad
      options.onLoad = function() {
        create(this, options)
        originCreate && originCreate.apply(this, arguments)
      }
      const originonDestroy = options.onUnload
      options.onUnload = function() {
        destroy(this)
        originonDestroy && originonDestroy.apply(this, arguments)
      }
      // 其他页面周期事件注入 pageListener
      Object.keys(pageLisener).forEach((key: Store.TPageLife) => {
        // 不能是周期事件
        if (
          typeof pageLisener[key] === 'function' &&
          pageLife.some(item => item === key)
        ) {
          const originLife = options[key]
          options[key] = function() {
            pageLisener[key].apply(this, arguments)
            originLife && originLife.apply(this, arguments)
          }
        }
      })
      this.originPage<TData, TCustom>(options)
    }

    if (!this.nonWritable) {
      try {
        Page = App.Page
      } catch (e) {}
    }

    // 重写组件
    App.Component = function(o = {}, ...args) {
      // 状态注入
      if (canUseStore(o)) {
        o.data = Object.assign(o.data || {}, {
          $state: _store.$state
        })
      }
      // 行为注入
      Object.keys(methods).forEach(key => {
        // 不能是周期事件
        if (
          typeof methods[key] === 'function' &&
          !pageLife.some(item => item === key)
        ) {
          o.methods || (o.methods = {})
          o.methods[key] = methods[key]
        }
      })
      // behavior
      if (behavior) {
        o.behaviors = [behavior, ...(o.behaviors || [])]
      }
      const {
        lifetimes = {}
      } = o

      let originCreate = lifetimes.attached || o.attached,
        originonDestroy = lifetimes.detached || o.detached
      const attached = function() {
        _create(this, o)
        originCreate && originCreate.apply(this, arguments)
      }

      const detached = function() {
        _destroy(this)
        originonDestroy && originonDestroy.apply(this, arguments)
      }
      if (_typeOf(o.lifetimes) === TYPE_OBJECT) {
        o.lifetimes.attached = attached
        o.lifetimes.detached = detached
      } else {
        o.attached = attached
        o.detached = detached
      }

      // 覆盖原周期
      originComponent(o, ...args)
    }
    if (!this.nonWritable) {
      try {
        Component = App.Component
      } catch (e) {}
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
  filterKey(obj: Store.IAnyObject, useKeys: string[] = [], fn: (key: string, usekey: string) => boolean) {
    const result: Store.IAnyObject = {}
    Object.keys(obj)
      .filter(key => useKeys.some(usekey => fn(key, usekey)))
      .forEach(key => {
        result[key] = obj[key]
      })
    return result
  }
}