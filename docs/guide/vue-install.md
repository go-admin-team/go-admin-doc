---
title: Node 环境
order: 60
toc: content
description: go-admin-ui 前端开发环境搭建：安装 Node.js 与 pnpm，配置国内镜像源。go-admin-ui 要求 Node 22 及以上、pnpm 9 及以上。
keywords: [node 安装教程, pnpm 安装, vue3 开发环境, node 版本要求]
---

:::warning
本节内容为 Node.js 开发环境及 IDE 配置教程，仅针对前端新选手，老司机请绕行。

:::

[老司机绕行](/guide/ksks)

## node.js & npm 安装

### 下载

官方下载地址 [https://nodejs.org/zh-cn/download/](https://nodejs.org/zh-cn/download/) ，可以选择适合自己操作系统的版本，建议选择长期支持版下载对应的版本：

:::warning
**go-admin-ui 要求 Node 22 及以上**（见 `package.json` 的 `engines` 字段）。
Node 14 / 16 / 18 / 20 均已结束维护，且构建工具 Vite 8 在这些版本上无法运行。
:::

<img src="https://doc-image.zhangwj.com/img/nodejs-down.png" alt="nodejs-down"  width="400px"/>

### 安装

双击下载好的安装包，按照以下流程进行操作；

<img src="https://doc-image.zhangwj.com/img/nodejs-step1.png" alt="nodejs-step1"  width="400px"/>

<img src="https://doc-image.zhangwj.com/img/nodejs-step2.png" alt="nodejs-step2"  width="400px"/>

<img src="https://doc-image.zhangwj.com/img/nodejs-step3.png" alt="nodejs-step3"  width="400px"/>

<img src="https://doc-image.zhangwj.com/img/nodejs-step4.png" alt="nodejs-step4"  width="400px"/>

<img src="https://doc-image.zhangwj.com/img/nodejs-step5.png" alt="nodejs-step5"  width="400px"/>

安装完成后，`node` 与 `npm` 会被装到 `/usr/local/bin/` 下（上图截取自较早的安装包版本，界面与版本号可能与你下载到的不同，以实际安装流程为准）。

到这一步就说明`Node.js` & `NPM`已经安装好了！

### 验证

检查`node.js`版本信息，

```sh
$  node -v
v22.14.0
```

看到版本号不低于 `v22` 即说明当前 node.js 工作环境可用。

## pnpm 安装

go-admin-ui 使用 pnpm 管理依赖，仓库中提交的是 `pnpm-lock.yaml`。
用 npm 或 yarn 安装会忽略该锁文件，装到的依赖版本可能与 CI 不一致。

```sh
# 方式一：通过 npm 安装
$ npm install -g pnpm

# 方式二：使用 Node 自带的 corepack（无需额外下载）
$ corepack enable
```

验证：

```sh
$  pnpm -v
9.15.1
```

版本不低于 `9` 即可。

:::warning
从哪里获得帮助：
如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。
:::
