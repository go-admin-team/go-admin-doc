---
nav:
  title: 开发
  order: 2
  second:
    title: 进阶
    order: 1
group:
  title: 前端基础
  order: 3
title: 前端配置文件
order: 2
toc: content
description: go-admin-ui 前端配置说明：.env 环境变量文件与接口地址 VUE_APP_BASE_API 的配置方式。
keywords: [go-admin-ui 配置, vue 环境变量, VUE_APP_BASE_API 配置]
---

## 配置文件说明

三个环境各自对应一个文件：`.env.development`（本地开发）、`.env.production`（生产构建）、`.env.staging`（预发布）。核心是同两个变量：

```bash
# just a flag
ENV = 'development'

# base api
VUE_APP_BASE_API = 'http://localhost:8001'
```

- `ENV` 只是标记当前环境，一般不需要改；
- `VUE_APP_BASE_API` 是后端服务地址，前端所有请求都会拼在它后面。

:::warning
**新克隆的仓库，前端默认端口和后端对不上。** `.env.development` 默认指向 `localhost:8001`,而后端 `config/settings.yml` 的默认端口是 `8000`。按各自默认值直接跑起来，前端会连不上后端，登录报网络错误、验证码打不开都是这个原因。

两者改一致即可：要么把 `.env.development` 改成 `http://localhost:8000`,要么把后端 `application.port` 改成 `8001`。

:::

## 部署时怎么填

- **前后端同域部署**（推荐，见[部署环境](/guide/xmbs)）——留空，请求走当前域名，由 Nginx 转发到后端。仓库自带的 `.env.production` 就是这么配的（`VUE_APP_BASE_API = ''`）；
- **前后端不同域**——填后端的完整地址，例如 `https://api.example.com`。

## 常见问题

前端验证码打不开或接口报错，先确认当前环境对应的文件里 `VUE_APP_BASE_API` 指向的地址：后端是否真的在那个地址上监听，以及该地址在浏览器里能否直接访问到。

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
