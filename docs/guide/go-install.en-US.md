---
title: Go Environment
order: 30
toc: content
description: Setting up a Go development environment for go-admin — installing Go on Windows, macOS and Linux, configuring GOPATH and a mirror proxy, and verifying the install. go-admin requires Go 1.26 or later.
keywords: [go environment setup, golang installation guide, go version requirement, goproxy mirror configuration]
---

## Setting Up the Environment

:::info
This section covers installing the Go development environment, for readers setting up Go for the first time. For IDE configuration, see [IDE Setup](/en-US/guide/ide-env).

:::

Readers who already have Go set up can go straight to [Quick Start](/en-US/guide/ksks).

### 1. Download

Official download page: [https://golang.org/dl/](https://golang.org/dl/) — pick the build for your OS; the latest version is downloaded by default:

<img src="https://doc-image.zhangwj.com/img/godown.png" width="400px" />

### 2. Install

The Go site provides platform-specific install instructions at [https://golang.org/doc/install](https://golang.org/doc/install) — just follow them.

:::info
If you're not sure which one to grab, the "Go Download" prompt on the page below points at the right package for your system.

:::

<img src="https://doc-image.zhangwj.com/img/go-install.png" width="400px" />

Double-click the downloaded installer and follow the steps:

<img src="https://doc-image.zhangwj.com/img/go-install-step1.png" width="400px" />

<img src="https://doc-image.zhangwj.com/img/go-install-step2.png" width="400px" />

<img src="https://doc-image.zhangwj.com/img/go-install-step3.png" width="400px" />

<img src="https://doc-image.zhangwj.com/img/go-install-step4.png" width="400px" />

That's it — Go is installed.

### 3. Verify

Check the Go version:

```sh
$ go version
go version go1.26.5 darwin/arm64
```

This confirms the install worked — `go1.26.5 darwin/arm64` here, since this was run on macOS (hence `darwin`). The string reflects whatever OS you're on; Windows and Linux will show something different.

:::warning
**go-admin requires Go 1.26 or later**, per the `go` directive in the repository's `go.mod`.
An older version fails outright at the `go build` step.
:::

:::warning
Where to get help:
If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).
:::
