---
nav:
  title: 开发
  order: 2
  second:
    title: 指令
    order: 2
title: install 安装
order: 100
toc: content
description: go-admin-pro 的 install 指令：通过可视化引导页面完成项目初始化。该指令仅存在于订阅版，开源版不提供。
keywords: [go-admin install, go-admin 安装命令, golang 项目初始化]
---

:::error
**本指令仅存在于 go-admin-pro（订阅版）。**

开源版 go-admin 未注册 `install` 指令，执行会提示找不到命令。开源版的初始化流程见[快速开始](/guide/ksks)，数据库初始化使用 [migrate 指令](/intro/cmd/migrate)。

:::

<br>

## 项目初始化

`go-admin-pro` 为了更好的用户体验减少用户的配置，提供了`install`指令，用于初始化项目，生成配置文件，生成数据库表。

```sh
$ go run main.go install
```

这样可以启动项目的可视化引导安装页面，按照提示进行操作即可。

页面示例：

![](https://doc-image.zhangwj.com/img/install01.png)
![](https://doc-image.zhangwj.com/img/install02.png)
![](https://doc-image.zhangwj.com/img/install03.png)
![](https://doc-image.zhangwj.com/img/install04.png)
![](https://doc-image.zhangwj.com/img/install05.png)

到这里就完成配置了。
