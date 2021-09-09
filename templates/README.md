# node-help

## 项目命令

- 启动项目 `npm run dev:dev-zh`
- 打包项目 `npm run build:prod-zh`
- 压缩图片 `npm run minify`

## 项目结构

```bash
.
├── .vscode              // vscode配置
│   └── settings.json
├── admin                // 后台服务
│   ├── controller       // 路由控制层
│   ├── router           // 路由主入口
│   └── utils            // 后台服务工具函数
├── config               // 接口配置目录
├── dist                 // 编译输出目录
├── lang                 // 语言配置
├── scripts              // gulp环境工具函数
├── src                  // 项目代码
│   ├── assets           // 静态文件
│   │   ├── css          // 样式文件
│   │   │    └── common  // 公共css
│   │   ├── icons        // 图标库
│   │   ├── img          // 图片
│   │   └── js           // js
│   │       └── common   // 公共js文件
│   ├── components       // 组件
│   └── views            // 页面
├── them                 // less入口（包括定义less变量）
├── .eslintignore        // eslint忽略检测配置
├── .eslintrc            // eslint检测规则配置
├── .npmrc               // 依赖加速下载配置
├── .yarnrc              // 依赖加速下载配置
├── gulpfile.js          // gulp打包配置
├── package.json         // 项目依赖
├── README.md            // 项目介绍
├── server.js            // 项目服务
└── yarn.lock            // 项目锁定依赖版本
```

## 打包工具

> 由 gulp 打包处理

## 渲染方式

> 采用 ejs 模板引擎,koa 作为中间层,负责处理根据路由选择页面 并向 服务端请求数据填充页面，最后返回页面

## 开发简介

> 本项目不支持 `import promise` 等 es6 语法，可支持箭头函数

- ### **_img_**

  - 位置：`src/assets/img/`
  - img 采用熊猫图片压缩处理，每月只能压缩 500 张，所以 `npm run dev && npm run build` 并未配置压缩图片
  - 压缩图片命令 `npm run minify`

- ### **_js_**

  - 位置：`src/assets/js/`
  - `npm run dev` 不会对 js 进行 babel 编译和压缩
  - `npm run build` 对 js 编译并压缩

- ### **_ejs_**

  - 位置：`src/views/`
  - 模板参考 `src/views/template.ejs`

- ### **_i18n_**

  - 页面位置：`src/views/i18n`
  - 写法：ejs 写法
  - 服务端位置：`admin/controller/i18n`
  - 写法：返回字段

- ### **_打包_**

  ```javascript
  /**
   * @example
   * npm run dev:dev-zh
   * @parms {string} dev 开发环境
   * @parms {string} dev-zh 读取config下的对应配置文件dev-zh.js
   */
  ```

- ### **_页面缓存_**

  - 缓存根据环境变量控制，开发环境缓存关闭，生产环境打开

- ### **_请求压缩_**

  - node 服务对所有请求开启 gzip 压缩，保证传输量更小，提高传输速度

- ### **_公共配置_**

  - **环境变量**：

    - **基础路由**：`BASE_URL`,开发环境值为`/`，生产环境为 oss 前缀，便于后期静态资源挂在 oss，生产环境静态资源加 oss 前缀。 用法：`BASE_URL/css/header/header.css`

    - **环境类型**：`PROCESS_ENV`, 开发环境值为`dev`，生产环境值为`prod`

    - **节点类型**：`PROCESS_LANG`，值可以是`zh`、`en`、`kr`，**用途**：作为语言的默认值；页面中不同节点差异化判断依据，如在 ejs 文件中，`<% if('PROCESS_ENV' === 'zh') { %> 显示国内节点 <% } else { %> 显示国外节点 <% } %>`

  - **公共 meat**

    - html: `/src/components/meta/index.ejs`
    - 公共样式文件

* ### 项目依赖管理

  > 项目目前采用公司私有仓库，依赖维护在当前项目的 `package` 分支，当 `package` 分支升级包，当前项目的 `package.json` 需要更新包的版本号



* ## 部署相关命令注解

  - 下载包依赖：

  ```
    yarn
  ```

  - 打包：

  ```
    yarn build:prod-zh：打包线上环境 zh 节点
  ```

  - 启动：(项目启动只能以下命令，pm2 直接启动或者 restart)

  ```
    yarn pm2-dev-zh：启动dev环境 zh 节点
  ```

* ## 发布命令（以线上为例）

  ```
  yarn && yarn build:prod-zh && pm2 delete node-help-zh && yarn pm2-prod-zh

  1. yarn 下载依赖
  2. yarn build:prod-zh 打包线上(打包输出在当前目录下的 dist 目录中的 assets 和 static 手动替换到oss)
  3. pm2 delete node-name-zh 删除原有的pm2进程（首次发布不需要）
  4. yarn pm2-prod-zh 启动服务
  ```
