/** 项目配置文件 */
interface IConfig {
  /** 版本号 */
  version: string;
  /** 版本说明 */
  versionDesc: string;
  /** 服务器环境是否为生产环境 */
  isProd: boolean;
  /** 服务器环境 */
  env: "pro" | "dev";
  /** 服务器域名 */
  rootUrl: string;
  /** 小程序tabbar页面的路径 */
  tabBarUrlList: string[];
}

/** key为string的对象 */
type IAnyObject = Record<string, any>;

/** api请求配置 */
interface IReqConfig {
  /** 请求前是否显示 loading */
  showLoading?: boolean;
  /** loading 文本 */
  loadingTitle?: string;
  /** 非 200 响应 toast 错误信息 */
  showToast?: boolean;
  /** 发送至服务器的数据流类型 */
  contentType?: string;
}

interface IRes {
  status: number;
  message: string;
  data: any;
}
/** 小程序request成功后，返回的数据结构 */
interface ISuccessRes<R extends IRes> {
  /** 开发者服务器返回的数据 */
  data: R;
  /** 开发者服务器返回的 HTTP Response Header */
  header: object;
  /** 开发者服务器返回的 HTTP 状态码 */
  statusCode: number;
  errMsg: string;
}

/** 小程序request失败后，返回的数据结构 */
interface IFailRes {
  errMsg: string;
}

/** 分页配置 */
interface IPagingConfig {
  /** 当前页码 */
  page: number;
  /** 每页显示条目个数 */
  size: number;
  /** 是否是初次加载，用来显示空列表"正在获取数据"，初始为true */
  isFirstLoading: boolean;
  /** 是否没有更多，用来底部显示"没有更多"，初始为false */
  isNoMore: boolean;
  /** 是否没有更多，用来底部显示"正在加载"，初始为false */
  isLoading: boolean;

  /** 数据列表 */
  list?: IAnyObject[];
  /** 数据总条目数 */
  total?: number;
  /** 是否需要重置分页数据，初始为false */
  needReset?: boolean;
}
