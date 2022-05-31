---
title: Go开发环境
order: 70
toc: menu
---

## 环境安装

<Alert type="info">
本节内容为 Golang 开发环境及 IDE 配置教程，适用于Golang新选手
    
</Alert>

[🚪 老司机绕行](/guide/ksks)

### 1. 下载

官方下载地址 [https://golang.org/dl/](https://golang.org/dl/) ，可以选择适合自己操作系统的版本，默认下载最新版本：

![](https://raw.githubusercontent.com/wenjianzhang/image/master/img/godown.png)

### 2. 安装

`Golang` 官网直接给出了安装指引，可以访问 [https://golang.org/doc/install](https://golang.org/doc/install) 按照指引下一步就好了；

<Alert type="info">
如果不清楚下载哪一个，可以根据下图 1.Go Download 处有提示适合的安装包

</Alert>

![](https://raw.githubusercontent.com/wenjianzhang/image/master/img/go-install.png)

双击下载好的安装包，按照以下流程进行操作；

![](https://raw.githubusercontent.com/wenjianzhang/image/master/img/go-install-step1.png)

![](https://raw.githubusercontent.com/wenjianzhang/image/master/img/go-install-step2.png)

![](https://raw.githubusercontent.com/wenjianzhang/image/master/img/go-install-step3.png)

![](https://raw.githubusercontent.com/wenjianzhang/image/master/img/go-install-step4.png)

到这一步就说明`Golang`已经安装好了！

### 3. 验证

检查一下`Golang`版本信息，

```sh
$ go version
go version go1.16.4 darwin/amd64
```

看到以上信息说明当前工作环境已经安装成功了`go1.16.4 darwin/amd64`，当前笔者因为是 MacOS 所以提示的是`darwin`。这个信息会根据操作系统当前安装的版本提示。`windows`和`linux` 会有所不同；

<Alert type="warning">
    从哪里获得帮助：

    如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。


</Alert>
