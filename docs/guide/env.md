---
title: 环境变量
order: 50
toc: content
description: go-admin 开发相关的 Go 环境变量说明：GOPROXY 国内代理配置、GO111MODULE 在新版本中的默认行为，以及 Windows、macOS、Linux 上的设置方法与生效优先级。
keywords: [go 环境变量配置, GOPATH 设置, windows 配置 go 环境变量, goproxy 设置]
---

# 环境变量

Go 的行为由若干环境变量控制。本文说明与 go-admin 开发相关的几个，以及在各操作系统上的设置方法。

:::info
如果使用 Go 1.16 及以上版本（go-admin 要求 1.26 及以上），`GO111MODULE` 已经默认为 `on`，**通常不需要手动设置**。
真正需要配置的一般只有 `GOPROXY`——国内直接拉取模块经常超时。

:::

## 相关的环境变量

| 变量 | 作用 | 建议值 |
| --- | --- | --- |
| `GOPROXY` | 模块代理地址，解决拉取依赖缓慢或超时 | `https://goproxy.cn,direct` |
| `GO111MODULE` | 是否启用 Go Modules | 不设置即可，1.16 起默认 `on` |
| `GOPATH` | 工作区目录，模块模式下仅用于存放下载的依赖与二进制 | 保持默认 |
| `GOPRIVATE` | 私有仓库前缀，匹配的模块不走代理、不做校验 | 有私有依赖时按需设置 |

`GOPROXY` 末尾的 `,direct` 表示代理返回 404 时回源直接拉取，建议保留。

## 查看当前配置

设置前后都可以用这条命令确认实际生效的值：

```sh
$ go env GOPROXY GO111MODULE
https://goproxy.cn,direct
on
```

查看全部配置用 `go env`。

## macOS / Linux

推荐用 `go env -w` 写入，它会保存到 Go 自己的配置文件，重开终端依然生效，也不必修改 shell 配置：

```sh
$ go env -w GOPROXY=https://goproxy.cn,direct
```

如果希望写进 shell 配置（例如需要被其他工具读取），按所用的 shell 追加到对应文件：

```sh
# zsh（macOS 默认）
$ echo 'export GOPROXY=https://goproxy.cn,direct' >> ~/.zshrc && source ~/.zshrc

# bash
$ echo 'export GOPROXY=https://goproxy.cn,direct' >> ~/.bashrc && source ~/.bashrc
```

:::warning
`go env -w` 与 shell 中的 `export` 同时存在时，**环境变量优先级更高**，会覆盖 `go env -w` 写入的值。
配置没有按预期生效时，先用 `go env GOPROXY` 确认实际取到的是哪一个。

:::

## Windows

命令行方式与上面相同：

```powershell
> go env -w GOPROXY=https://goproxy.cn,direct
```

也可以通过图形界面设置。右键`我的电脑`，选择`属性`;

<img src="https://doc-image.zhangwj.com/img/wodediannaoshuxing.png" width="400px" />

点击`高级系统设置`；

<img src="https://doc-image.zhangwj.com/img/xitongshuxing.png" width="400px" />

点击`环境变量`；

<img src="https://doc-image.zhangwj.com/img/huanjingbianliang1.png" width="400px" />

点击`新建`，填写变量名 `GOPROXY`，变量值 `https://goproxy.cn,direct`；

<img src="https://doc-image.zhangwj.com/img/huanjingbianliang3.png" width="400px" />

依次点击`确定`保存。

<img src="https://doc-image.zhangwj.com/img/huanjingbianliang4.png" width="400px" />

设置完成后需要**重新打开命令行窗口**才会生效，已打开的窗口读不到新值。

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
