---
title: IDE 配置
order: 70
toc: menu
description: go-admin 开发的 IDE 配置建议：GoLand 与 VSCode 的选择、安装与基础配置。
keywords: [goland 配置, vscode go 开发, go 开发工具, go ide 推荐]
---

# IDE 配置

Go 开发常用的 IDE 是 JetBrains 的 GoLand 与微软的 VSCode。GoLand 开箱即用、对调试与重构的支持更完整；VSCode 免费，装上官方 Go 扩展后同样够用。两者都可以，本文分别说明如何配置 go-admin 项目。

## 打开项目

go-admin 是标准的 Go Modules 项目，**用 IDE 直接打开仓库根目录即可**，不需要放进 `GOPATH`。

打开后先确认依赖已就绪：

```sh
$ go mod tidy
```

## GoLand

### 配置运行

`Run` → `Edit Configurations` → 新增一个 `Go Build`,按下表填写：

| 字段 | 值 |
| --- | --- |
| Run kind | `Package` 或 `Directory` |
| Package path / Directory | 仓库根目录 |
| Program arguments | `server -c config/settings.yml` |
| Working directory | **仓库根目录** |

`Working directory` 必须指向仓库根目录。`-c config/settings.yml` 是相对路径，工作目录不对会提示找不到配置文件。

数据迁移同理，把 Program arguments 换成 `migrate -c config/settings.yml` 即可，这样能在迁移代码里打断点调试。

### 使用 SQLite 时

若配置的是 `driver: sqlite3`,必须加构建标签，否则启动即 panic：

在 `Go tool arguments` 中填入 `-tags sqlite3`。

原因见[常见问题](/guide/faq)——不加标签时编进的是不含 sqlite3 驱动的版本，报错信息不会提到构建标签，容易误判成环境问题。

## VSCode

### 必备扩展

安装官方 [Go 扩展](https://marketplace.visualstudio.com/items?itemName=golang.Go)。首次打开 `.go` 文件时，右下角会提示安装 `gopls`、`dlv` 等工具，全部装上即可。

### 配置调试

在项目根目录创建 `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "go-admin server",
      "type": "go",
      "request": "launch",
      "mode": "auto",
      "program": "${workspaceFolder}",
      "cwd": "${workspaceFolder}",
      "args": ["server", "-c", "config/settings.yml"]
    },
    {
      "name": "go-admin migrate",
      "type": "go",
      "request": "launch",
      "mode": "auto",
      "program": "${workspaceFolder}",
      "cwd": "${workspaceFolder}",
      "args": ["migrate", "-c", "config/settings.yml"]
    }
  ]
}
```

使用 SQLite 时，在对应配置中追加构建标签：

```json
      "buildFlags": "-tags=sqlite3"
```

## 前端项目

go-admin-ui 用 VSCode 打开，建议安装 `Vue - Official` 扩展（原 Volar）。注意如果之前装过 Vetur，需要禁用它——两者同时启用会互相干扰，出现大量误报的语法错误。

## 常见问题

| 现象 | 原因 |
| --- | --- |
| 提示找不到配置文件 | 运行配置的工作目录不是仓库根目录 |
| 启动时 sqlite 相关 panic | 缺少 `-tags sqlite3` 构建标签 |
| 代码大量标红但能正常编译 | 依赖未下载完，执行 `go mod tidy` 后重启 IDE |
| 断点不生效 | 编译优化所致，确认以 Debug 而非 Run 方式启动 |

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
