---
nav:
  title: 开发
  order: 2
  second:
    title: 进阶
    order: 1
group:
  title: 服务端基础
  order: 2
title: 后端目录结构
order: 1
toc: content
description: go-admin 后端项目的目录结构说明：cmd、app、common、config 各目录的职责划分。
keywords: [go-admin 目录结构, golang 项目结构, gin 项目分层]
---


首先介绍一下 go-admin 的目录结构：

```bash
.
├── Dockerfile
├── LICENSE.md 
├── Makefile 
├── README.en.md 
├── README.md 
├── _config.yml 
├── app # 应用文件夹
│   ├── admin # admin应用
│   │   ├── apis # api 
│   │   ├── models # 模型 
│   │   ├── router # 路由 
│   │   └── service # 业务逻辑 
│   └── jobs #自动化作业
│       ├── apis # api 
│       ├── models # 模型 
│       ├── router # 路由 
│       └──  service # 业务逻辑
├── cmd # 命令 
├── common #公共类 
├── config # 系统配置 
├── docs # 文档 
├── go.mod
├── go.sum 
├── logger # 日志包 
├── main.go 
├── package-lock.json
├── static # 静态文件 
├── temp # 临时文件 
├── template # 模版文件 
├── test # 测试 
└── tools # 工具 

```

这些目录和文件的用处是：

- 最外层 go-admin 是项目根路径
- app： 应用文件夹
  - admin：admin 应用
    - apis： api
    - models： 数据访问层
    - router： 路由以及中间件
    - middleware: 中间件
- config： 配置相关的文件以及类
- docs： 接口文档
- static： 上传静态文件
- temp： 临时日志文件
- template： 模板文件
- test： 测试
- tools 工具
- main.go： 主入口
