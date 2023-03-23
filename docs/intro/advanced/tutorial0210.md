---
nav: 开发
group:
  title: 前端基础
  order: 1
title: 目录结构
order: 1
toc: content
---

让我们看一下 go-admin-ui 的目录结构：

```bash
.
├── README.md
├── dist
├── index.html
├── jsconfig.json
├── mock
├── package.json
├── prettier.config.js
├── public
│   ├── favicon.ico
│   └── login_left_bg.jpg
├── src
│   ├── App.vue
│   ├── api
│   ├── components
│   ├── icons
│   ├── layout
│   ├── main.js
│   ├── router
│   ├── store
│   ├── style
│   ├── utils
│   └── views
├── vite.config.js
├── .env.production
└── .env.development

```

这些目录和文件的用处是：

- 最外层 go-admin-ui 是项目根路径
- dist 打包后的文件
- index.html 入口文件
- jsconfig.json js 配置文件
- mock 模拟数据
- package.json 项目依赖
- prettier.config.js 代码格式化配置
- public 静态文件
  - favicon.ico 网站图标
  - login_left_bg.jpg 登录页背景图
- src 源码
  - App.vue 入口组件
  - api 接口
  - components 公共组件
  - icons 图标
  - layout 布局
  - main.js 入口文件
  - router 路由
  - store vuex
  - style 样式
  - utils 工具
  - views 页面
- config： 配置相关的文件以及类
- docs： 接口文档
- static： 上传静态文件
- temp： 临时日志文件
- template： 模板文件
- vite.config.js vite 配置文件
- .env.production 生产环境配置文件
- .env.development 开发环境配置文件
