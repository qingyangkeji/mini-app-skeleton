# miniapp 微信小程序脚手架

## 使用

- ```shell
  npm uninstall gulp -g  
  npm install gulp -g  # gulp 4
  npm install yarn -g

  yarn
  yarn dev
  ```

- 将微信小程序的项目目录设置为dist

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
  yarn build # 编译项目
  yarn l # gulp wechat -l, --login 登录
  yarn o # gulp wechat -o, --open 打开项目 ( 会提前进行编译 )
  yarn p # gulp wechat -p, --preview 预览
  yarn ap # gulp wechat --auto-preview 自动预览( 开发者微信会自启动 )
  yarn u # gulp wechat -u, --upload 上传 ( 会提前进行编译 )
  yarn close # gulp wechat --close 关闭项目窗口
  yarn quit # gulp wechat --quit 退出开发者工具
  ```


## 上线

- 更新[配置文件](src/config.js)的`version`。
- 修改[配置文件](src/config.js)的`isProd`为`true`，将环境设置为生产环境。
- 修改[配置文件](src/config.js)的`versionDesc`，完善版本说明。
- `yarn u` 上传代码，提交微信审核。
  > `yarn u` 会自动以[配置文件](src/config.js)中的`versionDesc`为描述，并附加环境信息。

## 版本日志

- 1.0.0
  - 小程序上线。