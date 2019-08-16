# mini-app-skeleton 微信小程序脚手架

微信小程序原生开发框架，集成`TypeScript`、`Stylus`、微信命令行，提供`Request`、`Api`等架构方案。

支持`JS`、`TS`代码共存，低成本渐进项目迁移。

提供了`Snippets`代码片段，提高开发效率。

## 特性

- [x] 集成`TypeScript`，提供类型支持
- [x] 集成`Request`，`Api`架构方案
- [x] 集成CSS预处理器Stylus
- [x] 集成微信开发工具命令行[官方API](https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html)
  - [x] 快速登录：`yarn l`命令行直接启动
  - [x] 快速预览：`yarn p`命令行打印二维码
  - [x] 自定义编译预览：`yarn cp`扫码调试指定页面
  - [x] 自动预览：`yarn ap`无需扫码，手机自启
  - [x] 一键上传：`yarn u`自动填充**服务器环境**、**版本号**、**版本说明**，上线版本信息更明确
  - [x] 一键关闭和退出：`yarn close`、`yarn quit`
- [ ] 版本记录管理

## 使用

- ```shell
  npm install gulp -g  # gulp 4
  npm install yarn -g  # 安装yarn

  yarn # npm i 安装依赖
  yarn dev # npm run dev 开发模式

  yarn build # npm run build 编译项目
  ```

- 将微信小程序的项目目录设置为根目录。

> 若要使用命令行调用工具，请打开工具 -> 设置 -> 安全设置，将服务端口开启。

## cli

- 新建Page

  ```shell
  gulp page --name index # 在src/pages/下新建一个index页面

  gulp page --name about --path user # 自定义路径: 在src/pages/user/下新建一个about页面
  ```

- 新建Component

  ```shell
  gulp comp --name input # 在src/component/下新建一个input组件

  gulp comp --name tabs-item --path tabs # 自定义路径: 在src/component/tabs/下新建一个tabs-item组件
  ```

- 调用微信开发者工具命令行

  ```shell
  yarn l # gulp wechat -l, --login 登录

  yarn o # gulp wechat -o, --open 打开项目 ( 会提前进行编译 )

  yarn p # gulp wechat -p, --preview 预览

  yarn cp # gulp wechat --cp 自定义预览 ( 可在build/config中配置compile-condition字段为自定义路径和参数 )

  yarn ap # gulp wechat --auto-preview 自动预览( 开发者微信会自启动 )

  yarn u # gulp wechat -u, --upload 上传 ( 会提前进行编译 )

  yarn close # gulp wechat --close 关闭项目窗口

  yarn quit # gulp wechat --quit 退出开发者工具
  ```


## 上传流程

- 更新[配置文件](src/config.ts)的`version`版本号。
- 修改[配置文件](src/config.ts)的`isProd`，`true`表示生产环境。
- 修改[配置文件](src/config.ts)的`versionDesc`，完善当前版本的说明。
- `yarn u` 或者 `npm run u` 上传代码。
> `yarn u` 会自动以[配置文件](src/config.ts)中的`versionDesc`为描述，并附加环境信息。

## 快速生成代码片段

可以通过修改[.vscode](./.vscode)下的snippets文件进行增加和修改。
> 使用snippets无需输入完整代码，只需要输入关键字母即可

- `qy-api`：快速生成Api接口、参数结构、响应结构模板
  ```ts
    namespace getUserInfo {
    interface IParams {
      userId: string
    }
    interface IResponse {
      name: string
      city: string
      openid: string
    }
  }
  // /** 获取用户信息 */
  // getUserInfo(params: Api.getUserInfo.IParams, reqConfig?: IReqConfig) {
  //   return request<Api.getUserInfo.IResponse>('GET', `/user`, params, reqConfig)
  // },
  ```
- `qy-api-call`：快速生成api接口调用模板
  ```ts
  const params = {
    userId: ''
  }
  api.getUserInfo(params, { showToast: false }).then(({ data, message }) => {
    // ...
  }).catch(err => {
    console.error(err)
  })
  ```
- `qy-comment`：快速生成`/** 单行注释 */`模板
  ```ts
  /** 单行注释 */
  ```
- `qy-promise`：快速生成`Promise`模板
  ```ts
  return new Promise((resolve, reject) => {
  
  })
  ```
- `qy-import-variable`：快速生成引入某个模块暴露的变量模板
  ```ts
  import { format } from 'utils'
  ```
- `qy-import-api`：快速生成引入api模块模板
  ```ts
  import api from "../api/index"
  ```
- `qy-weapp-toast`：快速生成小程序toast
  ```ts
  wx.showToast({
    icon: 'none',
    title: '提交成功',
    duration: 1500
  })
  ```