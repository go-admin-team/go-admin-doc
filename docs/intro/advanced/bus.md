---
nav:
  title: 开发
  order: 2
  second:
    title: 进阶
    order: 1
group:
  title: 开发模式
  order: 4
title: 常规模式
toc: content
order: 2
description: go-admin 的常规开发模式：当业务超出单表增删改查时，自行编写 Handler 与 Service 的处理方式。
keywords: [go-admin 常规模式, gin handler 编写, golang 业务分层]
---

# 常规模式

:::info
go-admin 有两种开发模式，按业务复杂度选择：

1. **[Actions 模式](/intro/advanced/advanced)** —— 单表增删改查优先使用。`common/actions` 提供的五个通用 Action
   已覆盖参数绑定、数据权限过滤、操作人注入、分页与错误响应，一个模块只需
   model、dto、router 三个文件，无需编写 apis 与 service。
2. **常规模式**（本页） —— 当业务超出单表 CRUD（跨表事务、外部调用、复杂校验）时，
   自行编写 Handler 与 Service。

可编译的完整示例见仓库的 `app/demo/` 目录，与本文冲突时以该目录为准。

:::

首先说明一下结构：
这里只是针对`app`文件夹说明；

```bash
.
└── admin
    ├── apis
    ├── models
    ├── router
    └── service
```

admin：可以理解成一个 project

apis：是 project 的 api 文件

models：是 project 的数据库层的模型

router：是 project 的路由

service：是 project 的业务逻辑处理

service.dto：是 project 的 api 对应的数据接收以及解析模型

搞清楚了这些我们开始往下进行；

直接使用项目中的源代码进行说明：我们操作日志为例；

按照 models、service.dto、service、apis、router 这个顺序来说明；

以上几个模块可以分别对应查看。

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
