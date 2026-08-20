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

首先介绍一下 go-admin 后端的目录结构：

```bash
.
├── app                  # 业务代码，见下方说明
├── cmd                  # 命令入口：api / migrate / config / app / version
├── common               # 公共代码：中间件、通用 Action、响应封装等
├── config               # 配置文件（settings.yml 等）与建表 SQL
├── docs                 # Swagger 生成的接口文档，勿手动编辑
├── scripts              # 部署脚本，如 Dockerfile
├── static               # 静态资源与上传文件目录
├── template             # 代码生成器使用的模板
├── test                 # 测试
├── AGENTS.md             # 给 AI 编码工具与新贡献者的开发约定
├── Dockerfile / docker-compose.yml   # 容器化部署配置
├── Makefile              # 构建、运行相关的常用命令
├── main.go               # 程序入口
├── go.mod / go.sum       # 依赖声明
└── restart.sh / stop.sh  # 简易的启动/停止脚本
```

## app 目录

业务代码都在这里，按应用（app）划分子目录，每个应用内部再按层级组织：

```bash
app
├── admin      # 内置的用户权限管理模块：用户、角色、菜单、部门、字典等
├── demo       # 标准模块的参照实现，见下方说明
├── jobs       # 定时任务的示例
└── other      # 公共接口，包含文件上传
```

以 `admin` 为例，内部结构是：

```bash
app/admin
├── apis              # Api 层，仅在超出单表 CRUD 时才需要
│   └── ...
├── models            # Model 层，GORM 结构体
├── router            # 路由注册
└── service
    └── dto           # DTO 定义
    └── ...           # Service 层，仅在超出单表 CRUD 时才需要
```

:::info
**新建应用不要直接修改 `admin`**，用 `app` 指令创建一个新的应用目录，方便后续跟随框架版本升级。见 [app 创建模块](/intro/cmd/app)。

:::

## app/demo：标准模块的参照物

`app/demo` 是当前推荐写法的完整示例，**可编译、有测试、CI 会跑**。标准的单表增删改查只需要三个文件：

```bash
app/demo
├── models/demo_product.go        # Model
├── service/dto/demo_product.go   # DTO
└── router/demo_product.go        # 路由 + 全部 CRUD，基于通用 Action
```

**没有 apis/，没有 service/**——通用 Action 已经覆盖了参数绑定、数据权限过滤、分页与响应封装。详见[标准模块开发](/intro/advanced/standard-module)与 [Actions 模式](/intro/advanced/advanced)。

只有业务超出单表增删改查（跨表事务、外部调用、复杂校验）时，才需要手写 Api 与 Service，此时才会用到 `apis/` 与 `service/` 目录，参照 `app/admin` 的写法。

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
