---
nav:
  title: 前端
  order: 3
title: 快速上手
order: 10
toc: content
description: go-admin-ui（Element Plus 版）零基础上手指南：安装依赖、配置接口地址、启动开发服务器、用默认账号登录，包含最容易踩的端口不一致的坑。
keywords: [go-admin-ui 快速开始, go-admin 前端启动, element plus 后台管理, vue3 admin 启动]
---

## 前端是什么

go-admin 前后端分离：[go-admin](https://github.com/go-admin-team/go-admin) 是后端服务，[go-admin-ui](https://github.com/go-admin-team/go-admin-ui) 是前端界面，也就是你打开浏览器实际看到、点来点去的那个管理后台。本文说的是 Element Plus 版本（go-admin 团队同时维护 Ant Design Pro 和 Arco Design 版本，写法不同，本栏目只讲 Element Plus 这一份）。

这个栏目不要求你会写 Vue。大部分业务页面不是手写出来的，而是用代码生成器从一张数据表"生成"出来的——后面几篇会讲怎么做。这一篇先让项目在你电脑上跑起来。

## 开始之前

前端需要一个能正常响应的后端接口。如果你还没有把后端跑起来，先看[快速开始](/guide/ksks)，把 go-admin 后端服务启动好、能用 Postman 或浏览器访问通，再回来做下面的步骤。

环境要求：

- Node.js 22 及以上
- pnpm 9 及以上

## 安装与启动

```sh
$ git clone https://github.com/go-admin-team/go-admin-ui.git
$ cd go-admin-ui
$ pnpm install
```

安装完成后，打开项目根目录下的 `.env.development` 文件，确认 `VUE_APP_BASE_API` 这一行的端口，和你的后端实际监听的端口一致：

```
VUE_APP_BASE_API = 'http://localhost:8001'
```

:::warning
这个文件里默认写的是 `8001`，但 go-admin 后端 `config/settings.yml` 里的默认端口是 `8000`。两边端口对不上，前端发出的每个请求都找不到人应答，界面会一直转圈或者显示网络错误——不是代码坏了，是这一行没改。按你后端实际启动时用的端口改这里就行。

:::

确认无误后启动开发服务器：

```sh
$ pnpm dev
```

终端提示服务启动后，浏览器打开 `http://localhost:9527`（默认端口，实际以终端输出为准），用默认账号登录：

- 用户名：`admin`
- 密码：`123456`

登录成功、能看到侧边栏菜单和首页，说明前端已经跑起来了。

## 接下来

- 想知道界面上的菜单、页面是怎么来的，看[界面是怎么组织的](/frontend/jiegou)
- 想做自己的业务功能，看[零基础做业务功能](/frontend/gen)

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin-ui/issues/new)。

:::
