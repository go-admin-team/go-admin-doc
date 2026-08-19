---
nav:
  title: 开发
  order: 2
  second:
    title: 进阶
    order: 1
group:
  title: 代码生成
  order: 6
title: 生成业务代码
order: 2
toc: content
description: go-admin 代码生成操作步骤：选择数据表、配置字段属性并生成前后端增删改查代码。
keywords: [go-admin 代码生成, golang crud 生成, 前后端代码自动生成]
---

## 代码生成

启动`go-admin` ，进入系统

<img src="https://doc-image.zhangwj.com/img/dashboradv1.0.0.png" width="700xp" />

打开以上程序画面，程序左侧有两个菜单，

1. 系统管理
2. 系统工具

<img src="https://doc-image.zhangwj.com/img/genv1.0.0.png" width="300xp" />

### 表结构导入

现在我们打开系统工具，进入 `代码生成` ，下边的画面请点击`导入`

:::success
这里的导入是要将我们刚刚创建的表导入到系统中，这样我们就可以根据表来生成代码了。

:::

<img src="https://doc-image.zhangwj.com/img/genimport1v1.0.0.png" width="700xp" />

选择刚才创建的 `article` 并点击 `确认` 按钮，将表结构导入系统。

<img src="https://doc-image.zhangwj.com/img/genimport2v1.0.0.png" width="700xp" />

### 编辑模板字段

确定后，表结构存储到了代码生成工具里，此时我们需要对导入数据进行编辑。

<img src="https://doc-image.zhangwj.com/img/genimport3v1.1.0.png" width="700xp" />

编辑红框里边的选项，之后点击保存。

<img src="https://doc-image.zhangwj.com/img/genimport4v1.0.0.png" width="700xp" />

### 预览代码

可以在预览处看到工具生成的代码。

<img src="https://doc-image.zhangwj.com/img/genimport5v1.0.0.png" width="700xp" />

### 生成代码

点击 `代码生成`,前后端代码会分别写入 `app/{应用}/` 与前端配置的 `frontpath` 对应目录下。

生成的路由默认怎么注册（是否需要登录、是否做角色鉴权）会随版本调整，生成后建议直接打开对应的 router 文件确认一遍，两种注册方式的区别见[路由注册](/intro/advanced/router)。

重启前端服务，接下来开始处理页面显示。

:::info
截图来自较早的版本，界面细节可能与当前版本有出入，但操作流程一致。

:::
