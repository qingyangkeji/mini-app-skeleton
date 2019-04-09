# miniapp 微信小程序脚手架

- 封装常用的page

## 使用

- ```npm run dev```
- 将微信小程序的项目目录设置为dist

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

>  需要全局安装gulp

## 上线

- 更新[配置文件](src/config.js)的`version`。
- 修改[配置文件](src/config.js)的`isProd`为`true`，将环境设置为生产环境。
- 上传代码，提交微信审核。

## 版本日志

- 1.0.0
  - 小程序上线。

## TODO
- [ ] release脚本