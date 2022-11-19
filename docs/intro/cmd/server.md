---
title: server
order: 20
toc: content
nav:
  title: 指令
  order: 3
---

## 视频教程

[【go-admin-pro】如何优雅添加 api（&适用于 go-admin）](https://www.bilibili.com/video/BV1pN4y157wp?spm_id_from=333.999.0.0)

## 服务启动

`go-admin` 针对 api 项目的启动提供`server`指令，在程序启动时使用；

首先需要将在项目根目录下执行`go build` 将程序编译：

```sh
go build
```

执行`go-admin server`指令，项目就可以启动了；

## 配置文件

但有一个问题是项目的配置文件如何加载？

`go-admin server`默认是加载 config/settings.yml 文件；

当然作者也考虑到大家不同的应用场景，开放了配置文件的配置接口，提供`-c`的参数，方便大家修改或者指定自己需要的配置文件；

例如：

```sh
$ go-admin server -c config/swtting.xxxx.yml # 注意config/swtting.xxxx.yml可以根据本地的环境进行修改，修成自己的文件路径
```

还需提醒一点，也是大家在这里常见的问题，因为我们上述的指令都是直接使用的`go-admin`，这里大家需要注意，因为在打包的时候如果使用的是`go build`，打包出来就是 go-admin 的一个二进制可执行文件，大家根据自己的系统和打包出来具体的文件名称进行调整上述指令；

例如：

本地打出来的是`sss-admin.exe`

执行命令就需要这样需要改，具体以本地环境为准

```sh
$ sss-admin.exe server
```

## 自动 api

`go-admin`为了大家更方便的添加 api 数据，还提供了一个`-a`参数：

```sh
# 系统在启动时自动检查路由中的api是否都记录在sys_api表中，如果缺少系统则会自动补充
# -a 默认值 false 默认可以不传
$ go-admin server -a true
```

## 提醒

上述讲的是通过编译后的二进制可执行文件启动，其实开发过程中还可以通过：`go run main.go` 直接启动项目。

例如：

```sh
$ go run main.go server
```
