# 目录及约定

## go-admin 目录

```bash
.
├── Dockerfile           // dockerfile 文件
├── app                  // app 目录 所有应用全部放在此目录下
│   └── admin            // admin 应用
│       ├── apis         // admin 下的api层全部在此文件夹中
│       ├── models       // orm 数据库模型
│       ├── router       // 全部路由
│       └── service      // service 根目录存放了当前应用的业务处理
│           └──dto       // dto 存放了 请求接收的模型
├── cmd                  // 项目命令 在此文件夹中
├── common               // 公用模块
├── config               // 配置项 存放了yml文件
├── docs                 // 接口文档
├── main.go              // 项目main文件
├── static               // 静态文件
├── temp                 // 临时文件
├── template             // 模版文件
└── test                 // 测试
```

### app

此目录下是放置，各个应用或者大业务模块代码的位置，每一个应用下边正常都需要包含 apis、models、router、service 这四个文件夹，其中 service 文件夹中有需要包含 dto 文件夹；这是 go-admin 针对 app 应用的一个标准目录结构要求；

### cmd

go-admin 内置了一些命令，在此文件夹中，如：server、version、migrate、config

### common

此目录放置一些公共的函数方法；

### config

此目录放置一下不同环境的配置文件，另外框架扩展的配置项结构体放在此目录；

### docs

此目录是 swagger 生成的 api 文档的存放位置；

### main.go

项目的入口；

### static

项目所需要的静态文件存放位置；

### temp

临时文件，例如 logs 目录会存放在这里；

### template

项目生成模版文件的存放位置；

### test

测试文件存放位置；

## go-admin-ui 目录

```bash
.
├── dist                  // 编译后文件存放位置
├── package.json          // package.json
├── plop-templates        // 基本模板
├── public                // 静态资源
│   ├── favicon.ico       // favicon图标
│   └── index.html        // html模板
├── src                   // 源代码
│   ├── App.vue
│   ├── api               // 所有请求
│   ├── assets            // 主题 字体等静态资源
│   ├── components        // 全局公用组件
│   ├── directive         // 全局指令
│   ├── filters           // 全局 filter
│   ├── icons             // 所有 svg icons
│   ├── layout            // 全局 layout
│   ├── main.js           // 入口文件 加载组件 初始化等
│   ├── permission.js     // 权限管理
│   ├── router            // 路由
│   ├── settings.js       // 项目基本配置
│   ├── store             // 全局 store管理
│   ├── styles            // 全局样式
│   ├── utils             // 全局公用方法
│   ├── vendor            // 公用vendor
│   └── views             // views 所有页面
├── tests                 // 测试
├── .env.xxx              // 环境变量配置
├── .eslintrc.js          // eslint 配置项
├── .babelrc              // babel-loader 配置
├── .travis.yml           // 自动化CI配置
└── vue.config.js         // vue-cli 配置
```

### ES6 语法

配置文件、mock 文件等都有通过 `@babel/register` 注册实时编译，所以可以和 src 里的文件一样，使用 ES6 的语法和 es modules 。

### dist

默认输出路径，可通过配置 `outputPath` 修改。

### src

约定 `src` 为源码目录。

### src/views

约定 views 下所有 vue 文件

### src/api

所有请求

### src/assets

主题 字体等静态资源

### src/main.js

入口文件 加载组件 初始化等

### src/permission.js

权限管理

### src/router

路由

### src/settings.js

项目布局基本配置，例如名称，布局相关

### src/tore

全局 store 管理

### src/styles

全局样式

### src/utils

全局公用方法

### .env

环境变量配置文件

### .env.xxx

不同环境的配置文件 例如：.env.development 开发环境配置文件 run dev 时使用；.env.production 生产环境配置文件 build 时使用；
