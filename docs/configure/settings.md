---
nav:
  title: 高阶
  order: 4
title: 配置参考
order: 5
toc: menu
description: go-admin 配置文件 settings.yml 完整参考：application、jwt、database、logger、cache、queue 等各配置块的字段说明、取值与生效范围，含生产环境必改项。
keywords: [go-admin 配置文件, settings.yml 配置说明, golang 项目配置管理, go-admin jwt 配置, go-admin 数据库配置]
---

## 配置参考

本页按配置块逐项说明 `config/settings.yml` 中的可用配置。

:::info
本页内容对照 go-admin `v2.4.0` 及其依赖的 go-admin-core 版本整理。
仓库中还提供了两份参考文件：`config/settings.full.yml`（较完整的示例）与
`config/settings.sqlite.yml`（SQLite 示例）。
:::

所有配置均在顶层 `settings` 之下：

```yml
settings:
  application: ...
  ssl: ...
  logger: ...
  jwt: ...
  database: ...
  gen: ...
  cache: ...
  queue: ...
  extend: ...
```

启动时通过 `-c` 指定配置文件，默认读取 `config/settings.yml`：

```sh
$ ./go-admin server -c config/settings.yml
```

## application

服务本身的运行参数。

| 配置项          | 类型   | 说明                                                     |
| --------------- | ------ | -------------------------------------------------------- |
| `mode`          | string | 运行模式，取值 `dev` / `test` / `prod` / `demo`，见下文    |
| `host`          | string | 监听地址，默认 `0.0.0.0`                                  |
| `port`          | int    | 监听端口                                                  |
| `name`          | string | 服务名称                                                  |
| `readtimeout`   | int    | HTTP 读超时，**单位：秒**                                  |
| `writertimeout` | int    | HTTP 写超时，**单位：秒**                                  |
| `enabledp`      | bool   | 数据权限功能开关，关闭后不再按部门维度过滤数据             |

### mode 的实际影响

`mode` 不只是一个标签，它会改变鉴权与路由行为，**务必按环境正确设置**：

| 取值   | 行为                                                                                        |
| ------ | ------------------------------------------------------------------------------------------- |
| `dev`  | 登录**跳过验证码校验**；JWT 有效期被强制设为 876010 小时（约 100 年），`jwt.timeout` 不生效 |
| `demo` | 拦截所有写操作，仅放行 `GET` / `OPTIONS` 与登录登出接口，用于公开演示站                       |
| `prod` | Gin 切换为 `ReleaseMode`；不注册 Swagger 路由、首页 `/` 与 `form-generator` 静态目录          |
| `test` | 代码中无专门分支，行为等同于「非 dev、非 prod、非 demo」                                      |

:::warning
生产环境必须设置 `mode: prod`。

若误将 `dev` 带上生产，会同时导致两个后果：登录不校验验证码，且签发的 token 近乎永不过期。

:::

## ssl

| 配置项   | 类型   | 说明                    |
| -------- | ------ | ----------------------- |
| `enable` | bool   | HTTPS 开关              |
| `domain` | string | HTTPS 对应的域名        |
| `key`    | string | SSL 证书 key            |
| `pem`    | string | SSL 证书路径            |

## logger

| 配置项      | 类型   | 说明                                                              |
| ----------- | ------ | ----------------------------------------------------------------- |
| `path`      | string | 日志存放路径                                                      |
| `level`     | string | 日志等级：`trace` / `debug` / `info` / `warn` / `error` / `fatal`   |
| `stdout`    | string | 控制台日志开关，填写非空值后日志输出到控制台，不再写入文件          |
| `enableddb` | bool   | 数据库日志开关，开启后打印 SQL                                     |
| `type`      | string | 日志组件类型                                                      |
| `cap`       | uint   | 日志通道容量                                                      |

:::warning
`level: trace` 会打印大量日志，生产环境建议调整为 `info` 或更高等级。

:::

## jwt

| 配置项    | 类型   | 说明                              |
| --------- | ------ | --------------------------------- |
| `secret`  | string | token 签名密钥                    |
| `timeout` | int64  | token 有效期，**单位：秒**         |

:::warning
`secret` 默认值为 `go-admin`，**上线前必须修改**，否则任何人都可以伪造 token。

另外注意：`mode: dev` 时 `timeout` 不生效（见上文 application 章节）。

:::

## database

| 配置项            | 类型   | 说明                                                          |
| ----------------- | ------ | ------------------------------------------------------------- |
| `driver`          | string | 数据库类型：`mysql` / `postgres` / `sqlite3` / `sqlserver`     |
| `source`          | string | 连接字符串                                                    |
| `maxIdleConns`    | int    | 最大空闲连接数，大于 0 时生效                                  |
| `maxOpenConns`    | int    | 最大打开连接数，大于 0 时生效                                  |
| `connMaxIdleTime` | int    | 连接最大空闲时间，**单位：秒**，大于 0 时生效                  |
| `connMaxLifeTime` | int    | 连接最大存活时间，**单位：秒**，大于 0 时生效                  |
| `registers`       | list   | 读写分离 / 业务分库配置，见 [业务分库](/configure)             |

各数据库的 `source` 写法：

```yml
# MySQL
source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms

# PostgreSQL
source: host=myhost port=myport user=gorm dbname=gorm password=mypassword

# SQLite3（需要 -tags=sqlite3,json1 编译）
source: sqlite3.db

# SQL Server
source: sqlserver://用户名:密码@地址?database=数据库名
```

连接池四项未配置或配置为 0 时，不会调用对应的设置方法，由 gorm 与数据库驱动使用各自的默认值。

### databases

多租户场景下按域名区分数据库，配置方式见 [多租户](/configure/tenant)。
未配置 `databases` 时，系统会自动以 `*` 为键，使用 `database` 的配置。

## gen

代码生成器相关配置。

| 配置项      | 类型   | 说明                                                        |
| ----------- | ------ | ----------------------------------------------------------- |
| `dbname`    | string | 代码生成读取的数据库名称                                     |
| `frontpath` | string | 生成的前端代码存放位置，需指定到 `src` 文件夹，使用相对路径   |

## cache

选择顺序是 **redis 优先，没配 redis 才用 memory**：

| 配置项            | 类型   | 说明                                  |
| ----------------- | ------ | ------------------------------------- |
| `memory`          | any    | 内存缓存，单实例部署留空即可          |
| `redis.addr`      | string | Redis 地址，如 `127.0.0.1:6379`       |
| `redis.password`  | string | Redis 密码                            |
| `redis.db`        | int    | Redis 逻辑库编号                      |
| `redis.pool_size` | int    | 连接池大小，不填用驱动默认值           |

:::warning
**`redis` 配置错误会导致服务启动失败**,不是静默降级为内存缓存。连接在启动阶段会被验证（默认 5 秒超时），地址或密码错都会报错退出。

多实例部署且需要共享缓存（验证码、token 等依赖它）时，必须配置 `redis`——单实例部署留空 `memory` 即可正常工作。

:::

## queue

同样是 **redis 优先，没配 redis 才用 memory**：

| 配置项                        | 类型   | 说明                                  |
| ------------------------------ | ------ | ------------------------------------- |
| `memory.poolSize`              | uint   | 内存队列的协程池大小                  |
| `redis.addr`                   | string | Redis 地址                            |
| `redis.password`               | string | Redis 密码                            |
| `redis.group`                  | string | 消费组，同一应用的多实例必须用同一个值 |
| `redis.key_prefix`             | string | stream key 前缀，多应用共用一个 redis 时用于隔离 |
| `redis.max_attempts`           | int    | 消息投递失败的最大重试次数            |

`redis` 段基于 Redis Stream，消息持久化、跨实例可见。与 cache 相同，配置错误会导致启动失败而不是静默降级。

完整用法与代码示例见[缓存](/intro/advanced/cache)与[队列](/intro/advanced/queue)。

## extend

自定义扩展配置。在 `config/extend.go` 中定义与配置文件对应的结构体，
之后通过 `config.ExtConfig` 读取。

```yml
extend:
  amap:
    key: your-key
```

```go
package config

var ExtConfig Extend

type Extend struct {
	AMap AMap
}

type AMap struct {
	Key string
}
```

读取方式：

```go
config.ExtConfig.AMap.Key
```

## 未被解析的配置项

`config/settings.yml` 中出现的 `locker` 配置块，在当前版本 core 的配置结构体中
没有对应字段，写了也不会被读取。

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
