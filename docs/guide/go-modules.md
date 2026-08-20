---
title: Go Modules
order: 40
toc: content
description: Go Modules 是 Go 官方的依赖管理方案，本文说明 GO111MODULE、GOPROXY 等关键设置的含义与 Go 各版本的行为变化。
keywords: [go modules 是什么, GO111MODULE 设置, goproxy 配置, go 依赖管理]
---

# Go Modules

Go Modules 是 Go 官方的依赖管理方案，自 Go 1.16 起是默认且唯一推荐的方式。go-admin 使用它管理依赖，日常开发中需要了解的内容如下。

## go.mod 与 go.sum

`go.mod` 描述项目的依赖，包含三部分信息：

1. **模块名**——项目内的包通过它相互引用，例如 go-admin 的模块名就是 `go-admin`;
2. **Go 版本**——声明项目要求的最低 Go 版本，go-admin 当前要求 1.26;
3. **依赖列表**——直接依赖与间接依赖（标注 `// indirect`）。

`go.sum` 记录每个依赖的校验和，用于确认下载到的代码与首次引入时一致。

:::warning
`go.sum` **必须提交到版本库**。它是防止依赖被篡改的依据，删掉它并不会"清理项目",只会让校验失效。

:::

## 常用命令

```sh
# 初始化模块（新项目才需要，go-admin 已自带 go.mod）
$ go mod init 模块名

# 整理依赖：补全缺失的、移除不再使用的
$ go mod tidy

# 把依赖下载到本地模块缓存
$ go mod download

# 查看某个包被谁引入（排查依赖冲突时很有用）
$ go mod why -m 包名

# 列出所有依赖及其版本
$ go list -m all
```

其中 `go mod tidy` 使用最频繁：**增删 import 之后执行一次**，它会同步更新 `go.mod` 与 `go.sum`。

## 依赖拉取失败

国内直接拉取模块经常超时，配置代理即可：

```sh
$ go env -w GOPROXY=https://goproxy.cn,direct
```

详见[环境变量](/guide/env)。

如果依赖来自私有仓库，需要同时声明 `GOPRIVATE`,让匹配的模块跳过代理与校验：

```sh
$ go env -w GOPRIVATE=git.yourcompany.com
```

## 使用本地依赖调试

需要调试 go-admin-core 这类被依赖的库时，可以用 `replace` 指向本地目录，避免每次改动都要发版：

```
replace (
    github.com/go-admin-team/go-admin-core => ../go-admin-core
)
```

:::warning
`replace` 只用于本地调试，**提交前务必移除**。带着它提交会导致其他人和 CI 拉取代码后无法编译，因为那个本地路径在他们的机器上并不存在。

:::

## 版本升级

```sh
# 升级单个依赖到最新版本
$ go get -u 包名

# 升级到指定版本
$ go get 包名@v1.2.3
```

升级框架依赖前建议先确认改动范围。go-admin 与 go-admin-core 的版本存在对应关系，单独升级 core 可能引入不兼容的接口，参考仓库 `go.mod` 中锁定的版本。

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
