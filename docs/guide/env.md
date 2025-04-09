---
title: 基础配置
order: 40
toc: content
---

# 环境变量

:::warning
本章我们主要说明如何配置 Go Modules 开启；如果已经配置完成，请直接忽略本章内容。

:::

## windows 中如何配置

右键`我的电脑`，选择`属性`;

<img src="https://doc-image.zhangwj.com/img/wodediannaoshuxing.png" width="400px" />

点击`高级系统设置`；

<img src="https://doc-image.zhangwj.com/img/xitongshuxing.png" width="400px" />

点击`环境变量`；

<img src="https://doc-image.zhangwj.com/img/huanjingbianliang1.png" width="400px" />

点击`新建`；
填写 变量名 `GO111MODULE`, 变量值 `on`；

<img src="https://doc-image.zhangwj.com/img/huanjingbianliang2.png" width="400px" />

点击`确定`;
点击`新建`；
填写 变量名 `GOPROXY`, 变量值 `https://goproxy.cn`；

<img src="https://doc-image.zhangwj.com/img/huanjingbianliang3.png" width="400px" />

点击`确定`;

<img src="https://doc-image.zhangwj.com/img/huanjingbianliang4.png" width="400px" />

点击`确定`;

重新打开 `CMD`，立即生效

## macOS 中如何配置

```bash
$ go env -w GOPROXY=https://goproxy.cn,direct
$ go env -w GO111MODULE=on
```

## linux 中如何配置

```bash
$ go env -w GOPROXY=https://goproxy.cn,direct
$ go env -w GO111MODULE=on
```

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
