---
nav:
  title: 开发
  order: 2
  second:
    title: 进阶
    order: 1
group:
  title: 前端基础
  order: 3
title: 启动前端服务
order: 3
toc: content
description: go-admin-ui 启动步骤：Node 与 pnpm 版本要求、依赖安装与开发服务器启动。
keywords: [go-admin-ui 启动, vue3 项目启动, pnpm dev 启动]
---

## 前端的启动

启动 go-admin-ui 项目。请运行下面的命令：

```bash
# 检查 node 版本，go-admin-ui 要求 Node 22 及以上
node -v

# go-admin-ui 使用 pnpm 管理依赖，未安装可先执行 corepack enable
pnpm -v

# 安装依赖，速度过慢时可配置国内镜像：
# pnpm config set registry https://registry.npmmirror.com
# 若安装报错，删除 node_modules 后重新安装即可（不要删除 pnpm-lock.yaml）
pnpm install

# 启动项目
pnpm dev
```

程序启动后，浏览器访问 <http://localhost:9527/>，你将会看到 `go-admin` 的登录页面。

