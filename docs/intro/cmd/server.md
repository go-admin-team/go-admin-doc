---
nav:
  title: 开发
  order: 2
  second:
    title: 指令
    order: 2
title: server 启动服务
order: 50
toc: content
description: go-admin server 指令：启动 API 服务，含 -c 指定配置文件、-a 自动登记接口到 sys_api 表等参数说明。
keywords: [go-admin server 启动, go-admin 启动参数, golang 服务启动命令]
---


## 服务启动

`go-admin` 针对 api 项目的启动提供`server`指令，在程序启动时使用；

首先在项目根目录下执行 `go build` 编译程序：

```sh
go build
```

执行`go-admin server`指令，项目就可以启动了；

## 配置文件

配置文件通过 `-c` 参数指定：

`go-admin server`默认是加载 config/settings.yml 文件；

当然作者也考虑到大家不同的应用场景，开放了配置文件的配置接口，提供`-c`的参数，方便大家修改或者指定自己需要的配置文件；

例如：

```sh
$ go-admin server -c config/settings.dev.yml # 路径可以按本地环境自行命名，例如 settings.dev.yml、settings.prod.yml
```

上述指令里的 `go-admin` 是 `go build` 默认产出的二进制文件名，执行时需要换成你本地实际编译出来的文件名——Windows 下通常带 `.exe` 后缀：

```sh
$ go-admin.exe server
```

## 自动 api

`go-admin`为了大家更方便的添加 api 数据，还提供了一个`-a`参数：

```sh
# 系统在启动时自动检查路由中的api是否都记录在sys_api表中，如果缺少系统则会自动补充
# -a 默认值 false 默认可以不传
$ go-admin server -a
```

## 提醒

上述讲的是通过编译后的二进制可执行文件启动，其实开发过程中还可以通过：`go run main.go` 直接启动项目。

例如：

```sh
$ go run main.go server
```

## 参考

视频教程（录制于订阅版，操作步骤同样适用于开源版）：

[【go-admin-pro】如何优雅添加 api（&适用于 go-admin）](https://www.bilibili.com/video/BV1pN4y157wp?spm_id_from=333.999.0.0)
