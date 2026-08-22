---
nav:
  title: Advanced
  order: 4
title: Config Reference
order: 5
toc: menu
description: A complete reference for go-admin's settings.yml — every field in application, jwt, database, logger, cache, queue and the other config blocks, what it does, and what must change before production.
keywords: [go-admin config file, settings.yml configuration reference, golang project config management, go-admin jwt configuration, go-admin database configuration]
---

## Config Reference

This page walks through every available setting in `config/settings.yml`, block by block.

:::info
This page is written against go-admin `v2.4.0` and the go-admin-core version it depends on.
The repository also ships two reference files: `config/settings.full.yml` (a more complete
example) and `config/settings.sqlite.yml` (a SQLite example).
:::

Everything lives under the top-level `settings` key:

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

The config file is specified at startup with `-c`; without it, `config/settings.yml` is read by default:

```sh
$ ./go-admin server -c config/settings.yml
```

## application

The service's own runtime parameters.

| Field           | Type   | Description                                                     |
| --------------- | ------ | ----------------------------------------------------------------- |
| `mode`          | string | Run mode: `dev` / `test` / `prod` / `demo` — see below            |
| `host`          | string | Listen address, defaults to `0.0.0.0`                             |
| `port`          | int    | Listen port                                                       |
| `name`          | string | Service name                                                      |
| `readtimeout`   | int    | HTTP read timeout, **in seconds**                                  |
| `writertimeout` | int    | HTTP write timeout, **in seconds**                                  |
| `enabledp`      | bool   | Data-permission switch; when off, data is no longer filtered by department |

### What mode Actually Does

`mode` isn't just a label — it changes authorization and routing behavior, so **set it correctly per environment**:

| Value  | Behavior                                                                                      |
| ------ | ----------------------------------------------------------------------------------------------- |
| `dev`  | Login **skips captcha verification**; the JWT lifetime is forced to 876,010 hours (about 100 years) — `jwt.timeout` has no effect |
| `demo` | Blocks every write operation, allowing only `GET` / `OPTIONS` and the login/logout endpoints — meant for a public demo site |
| `prod` | Gin switches to `ReleaseMode`; the Swagger route, the `/` homepage, and the `form-generator` static directory aren't registered |
| `test` | No dedicated branch in the code — behaves the same as "not dev, not prod, not demo"             |

:::warning
Production **must** set `mode: prod`.

Accidentally deploying with `dev` still set causes two problems at once: login skips captcha verification, and issued tokens essentially never expire.

:::

## ssl

| Field    | Type   | Description             |
| -------- | ------ | ------------------------ |
| `enable` | bool   | HTTPS switch             |
| `domain` | string | The domain HTTPS serves  |
| `key`    | string | SSL certificate key      |
| `pem`    | string | SSL certificate path     |

## logger

| Field       | Type   | Description                                                        |
| ----------- | ------ | --------------------------------------------------------------------- |
| `path`      | string | Log file directory                                                    |
| `level`     | string | Log level: `trace` / `debug` / `info` / `warn` / `error` / `fatal`     |
| `stdout`    | string | Console log switch — any non-empty value sends logs to the console instead of a file |
| `enableddb` | bool   | Database log switch — prints SQL when enabled                          |
| `type`      | string | Logger component type                                                  |
| `cap`       | uint   | Log channel capacity                                                   |

:::warning
`level: trace` prints a large volume of logs — for production, `info` or higher is recommended.

:::

## jwt

| Field     | Type   | Description                          |
| --------- | ------ | -------------------------------------- |
| `secret`  | string | The token signing secret               |
| `timeout` | int64  | Token lifetime, **in seconds**          |

:::warning
`secret` defaults to `go-admin` — **it must be changed before going live**, or anyone can forge a valid token.

Also note: under `mode: dev`, `timeout` has no effect (see the `application` section above).

:::

## database

| Field              | Type   | Description                                                        |
| ------------------- | ------ | --------------------------------------------------------------------- |
| `driver`            | string | Database type: `mysql` / `postgres` / `sqlite3` / `sqlserver`         |
| `source`            | string | Connection string                                                     |
| `maxIdleConns`      | int    | Max idle connections, applied when greater than 0                     |
| `maxOpenConns`      | int    | Max open connections, applied when greater than 0                     |
| `connMaxIdleTime`   | int    | Max connection idle time, **in seconds**, applied when greater than 0 |
| `connMaxLifeTime`   | int    | Max connection lifetime, **in seconds**, applied when greater than 0  |
| `registers`         | list   | Read/write splitting and sharding config — see [Sharding by Business](/en-US/configure) |

The `source` format for each database:

```yml
# MySQL
source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms

# PostgreSQL
source: host=myhost port=myport user=gorm dbname=gorm password=mypassword

# SQLite3 (requires building with -tags=sqlite3,json1)
source: sqlite3.db

# SQL Server
source: sqlserver://username:password@address?database=dbname
```

When the four connection-pool fields are left unset or set to 0, the corresponding setter is never called, and GORM and the database driver fall back to their own defaults.

### databases

Under multi-tenancy, databases are selected by domain — see [Multi-Tenancy](/en-US/configure/tenant) for how to configure it.
When `databases` isn't configured, the system automatically registers `database`'s config under the key `*`.

## gen

Config for the code generator.

| Field       | Type   | Description                                                     |
| ----------- | ------ | -------------------------------------------------------------------- |
| `dbname`    | string | The database name the generator reads from                          |
| `frontpath` | string | Where generated frontend code is written — must point at the `src` folder, as a relative path |

## cache

Selection order is **redis first, memory only if redis isn't configured**:

| Field              | Type   | Description                                        |
| ------------------ | ------ | ----------------------------------------------------- |
| `memory`           | any    | In-memory cache — leave empty for a single-instance deployment |
| `redis.addr`       | string | Redis address, e.g. `127.0.0.1:6379`                  |
| `redis.password`   | string | Redis password                                        |
| `redis.db`         | int    | Redis logical database index                          |
| `redis.pool_size`  | int    | Connection pool size — uses the driver's default if unset |

:::warning
**A misconfigured `redis` section makes the service fail to start** — it does not silently fall back to the in-memory cache. The connection is verified at startup (a 5-second timeout by default); a wrong address or password causes the service to exit with an error.

If you're running multiple instances and need a shared cache (captchas, tokens, and anything else that depends on it), `redis` must be configured — for a single instance, leaving `memory` empty works fine on its own.

:::

## queue

Same rule: **redis first, memory only if redis isn't configured**:

| Field                          | Type   | Description                                        |
| -------------------------------- | ------ | ----------------------------------------------------- |
| `memory.poolSize`                | uint   | Goroutine pool size for the in-memory queue            |
| `redis.addr`                     | string | Redis address                                          |
| `redis.password`                 | string | Redis password                                         |
| `redis.group`                    | string | Consumer group — every instance of the same app must use the same value |
| `redis.key_prefix`               | string | Prepended to the stream key, for isolating multiple apps sharing one Redis instance |
| `redis.max_attempts`             | int    | Max redelivery attempts for a message that fails       |

The `redis` option is built on Redis Streams — messages persist and are visible across instances. As with cache, a misconfiguration makes the service fail to start rather than silently degrading.

Full usage and code examples are in [Cache](/en-US/intro/advanced/cache) and [Queue](/en-US/intro/advanced/queue).

## extend

Custom configuration. Define a struct matching your config in `config/extend.go`, then read it via `config.ExtConfig`.

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

Read it like this:

```go
config.ExtConfig.AMap.Key
```

## Fields That Aren't Parsed

The `locker` block that appears in `config/settings.yml` has no corresponding field in the
current version of core's config struct — anything written there is never read.

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
