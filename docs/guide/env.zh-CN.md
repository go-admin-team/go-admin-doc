---
title: 基础配置
order: 2
toc: menu
nav:
  title: 指南
  order: 1
---

## 环境变量

::: warning
本章我们主要说明如何配置 Go Modules 开启；如果已经配置完成，请直接忽略本章内容。
:::

## windows 中如何配置

右键`我的电脑`，选择`属性`;

![](https://raw.githubusercontent.com/wenjianzhang/image/master/img/wodediannaoshuxing.png)

点击`高级系统设置`；

![](https://raw.githubusercontent.com/wenjianzhang/image/master/img/xitongshuxing.png)

点击`环境变量`；

![](https://raw.githubusercontent.com/wenjianzhang/image/master/img/huanjingbianliang1.png)

点击`新建`；
填写 变量名 `GO111MODULE`, 变量值 `on`；

![](https://raw.githubusercontent.com/wenjianzhang/image/master/img/huanjingbianliang2.png)

点击`确定`;
点击`新建`；
填写 变量名 `GOPROXY`, 变量值 `https://goproxy.cn`；

![](https://raw.githubusercontent.com/wenjianzhang/image/master/img/huanjingbianliang3.png)

点击`确定`;

![](https://raw.githubusercontent.com/wenjianzhang/image/master/img/huanjingbianliang4.png)

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
