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
title: 后端配置文件
order: 2
toc: content
description: go-admin 后端配置文件说明：数据库连接串的组成与常见配置项的填写方式。
keywords: [go-admin 配置文件, gin 数据库配置, mysql 连接串配置]
---

## 配置文件说明

第一次使用 go-admin 时需要做一次初始化设置，主要是数据库连接。可以用 MySQL（推荐），也可以用仓库自带的 SQLite 体验数据库快速跑起来（部分功能不支持，例如代码生成）。

打开 `config/settings.yml`,重点关注 `database` 一节：

```yml
settings:
  database:
    driver: mysql
    source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=5000ms
```

把 `source` 中的三项换成自己的：

- `user` —— 数据库用户名
- `password` —— 数据库密码
- `dbname` —— 数据库名称，需要提前建好这个库

其余配置项（`application`、`jwt`、`logger`、`gen` 等）保持默认即可跑通，完整字段说明见[配置参考](/configure/settings)——**当前版本没有 `application.logpath` 这个字段**，日志路径是 `logger.path`。

:::warning
生产环境上线前，`jwt.secret` 必须替换为随机字符串（默认值是 `go-admin`），`application.mode` 必须设为 `prod`。详见[配置参考](/configure/settings)。

:::

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
