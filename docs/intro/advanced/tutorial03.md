---
nav:
  title: 开发
  order: 2
  second:
    title: 进阶
    order: 1
group:
  title: 服务端基础
  order: 2
title: 启动后端服务
order: 3
toc: content
description: go-admin 后端服务启动步骤与启动成功的验证方法。
keywords: [go-admin 启动, gin 服务启动, golang 后端运行]
---

## 启动服务

确认项目配置成功，运行：

```bash
go run main.go server -c config/settings.yml
```

看到服务启动的日志输出即为成功。

## 验证

浏览器访问 <http://127.0.0.1:8000/info>,返回 `{"message":"ok"}` 说明服务已经在正常处理请求——这是最直接的健康检查，不依赖数据库是否配置正确。

访问根路径 <http://127.0.0.1:8000/>（仅非 `prod` 模式可用）会看到一个内嵌本文档站的欢迎页；访问 `/swagger/admin/index.html` 可以看到接口文档。这两个路由在 `application.mode: prod` 时不会注册，属于开发环境的便利功能。

## 修改监听地址与端口

打开 `config/settings.yml`,对应的字段是 `application.host` 与 `application.port`：

```yml
settings:
  application:
    # 监听地址，默认 0.0.0.0（监听所有网卡，局域网内其他设备可访问）
    host: 0.0.0.0
    # 监听端口
    port: 8000
```

只监听本机可以把 `host` 改为 `127.0.0.1`；需要用别的端口对外提供服务时改 `port`。修改后需要重启服务才会生效。

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
