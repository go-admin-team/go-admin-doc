# Golang 开发环境

::: tip
本节内容为 Golang 开发环境及 IDE 配置教程，仅针对 Golang 新选手，老司机请绕行。
[老司机绕行](/guide/ksks.html)
:::

## go 开发环境安装

### 下载

官方下载地址 [https://golang.org/dl/](https://golang.org/dl/) ，可以选择适合自己操作系统的版本，默认下载最新版本：

![](https://gitee.com/mydearzwj/image/raw/master/img/godown.png)

### 安装

`Golang` 官网直接给出了安装指引，可以访问 [https://golang.org/doc/install](https://golang.org/doc/install) 按照指引下一步就好了；

::: tip
如果不清楚下载哪一个，可以根据下图 1.Go Download 处有提示适合的安装包
:::

![](https://gitee.com/mydearzwj/image/raw/master/img/go-install.png)

双击下载好的安装包，按照以下流程进行操作；

![](https://gitee.com/mydearzwj/image/raw/master/img/go-install-step1.png)

![](https://gitee.com/mydearzwj/image/raw/master/img/go-install-step2.png)

![](https://gitee.com/mydearzwj/image/raw/master/img/go-install-step3.png)

![](https://gitee.com/mydearzwj/image/raw/master/img/go-install-step4.png)

到这一步就说明`Golang`已经安装好了！

### 验证

检查一下`Golang`版本信息，

```sh
$ go version
go version go1.16.4 darwin/amd64
```

看到以上信息说明当前工作环境已经安装成功了`go1.16.4 darwin/amd64`，当前笔者因为是 MacOS 所以提示的是`darwin`。这个信息会根据操作系统当前安装的版本提示。`windows`和`linux` 会有所不同；

:::tip
如果您在安装过程中遇到了其他问题，也可以通过[反馈](https://github.com/go-admin-team/go-admin/issues)的方式一起解决您的问题，同时我们很期待您的建议。
:::
