# mini-app-skeleton 微信小程序脚手架

轻量精悍，集成微信命令行。

从此，解放你的双手，提升你的开发效率。

从此，你将不再需要通过微信开发工具进行预览、上传，我们已经为你集成了微信全部开发命令。

从此，线上和测试环境将永不出错，编译代码自动显示当前环境。

## Feature

- [x] Stylus
- [x] 生产环境、测试环境快速切换
- [x] 集成微信开发工具命令行[官方API](https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html)
  - [x] 快速登录：命令行直接启动
  - [x] 快速预览：命令行打印二维码
  - [x] 自定义编译预览：扫码调试指定页面
  - [x] 自动预览：无需扫码，手机自启
  - [x] 一键上传：自动填充配置文件环境、版本号、版本说明
  - [x] 一键关闭和退出：命令行无所不能。
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

- 更新[配置文件](src/config.js)的`version`版本号。
- 修改[配置文件](src/config.js)的`isProd`，`true`表示生产环境。
- 修改[配置文件](src/config.js)的`versionDesc`，完善当前版本的说明。
- `yarn u` 或者 `npm run u` 上传代码。
> `yarn u` 会自动以[配置文件](src/config.js)中的`versionDesc`为描述，并附加环境信息。
