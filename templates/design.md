# 项目拆分

## 组件拆分

组件一共拆分为 `左侧导航栏`、`头部`、`右侧内容区`、`底部`四大模块。模块的样式(包括媒体查询)均写进公共样式文件`assets/css/common/style.css`

- ### 左侧导航栏

  `左侧导航栏` 包括 `层级类型` 和 `标签类型`

- ### 头部

- ### 右侧内容区

  `右侧内容区` 包括 `面包屑`、`系统列表`、`自定义列表`、`主页`、`文章内容` 和 `搜索列表`

- ### 底部

- ### 代码形式组件组装实例

```javascript

<!DOCTYPE html>
<html>
  <head>
    <!-- 公共meta标签 css链接 -->
		<%- include("../../components/meta/index.ejs") -%>
  </head>
  <body class="theme-default">

    <!-- 公共头部 -->
    <%- include("../../components/header.ejs") -%>

    <div class="content">

      <!-- 左侧菜单 -->
      <%- include("../../components/aside.ejs") -%>

      <div class="content-right">

        <!-- 面包屑 -->
        <%- include("../../components/breadcrumb.ejs") -%>

        <!-- 文章列表 -->
        <% if (articleList.total) {%>
          <%- include("../../components/list.ejs") -%>
        <% } else {%>
          <%- include("../../components/data_blank.ejs") -%>
        <% } %>
      </div>
    </div>

    <!-- 公共底部 -->
    <%- include("../../components/footer.ejs") -%>

    <!-- 左侧菜单栏js -->
    <script src="BASE_URL/assets/js/aside/aside.js"></script>

  </body>

</html>
```

## js css 划分

js 和 css 体量都相对较少，全部以组件名分文件写 http 请求数想对不划算，所以只把测导航和标签样式单独文件写（相对复杂），其它的都写在 common.css 中， 以 /\*_ ====== ======= _/ 分割。js 是单独把测导航分割，其他的 js 都在 common.js, 分割方式与 css 一致

## 代码实现

- 存储软件编码

  - 软件入口只能收首页，在首页服务端返回页面时用 set-cookie 的方式在浏览器中存储软件编码

- 路由格式

  - 以首页为例 '/gscad_2021_cn.html', 其格式为 '/:id', 即 'gscad_2021_cn.html' 为路由 params

  - 以搜索页为例 '/search/gscad_2021_cn.html?keywords=copy', 格式同上为'/search/:id', params 为在首页存储的软件编码，query 为 keywords=copy 的形式。原因：在搜索时候，接口需要软件编码字段。也可以在'/search'后面可以不跟软件编码，cookie 中已经携带，直接在 node 服务端获取 cookie, 个人考虑目前这种方式稍微直观点，先用当前方案

- 兼容性

  - js 兼容：全局引入 polyfill.min.js
  - IE 下 input 自带 x 号 placeholder.js
  - IE cookie 存取 jquery.cookie.js
  - 禁止使用 flex 等 css 写法
