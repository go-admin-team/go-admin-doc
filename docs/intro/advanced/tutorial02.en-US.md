---
nav:
  title: Development
  order: 2
  second:
    title: Advanced
    order: 1
group:
  title: Backend Basics
  order: 2
title: Backend Config File
order: 2
toc: content
description: go-admin's backend config file — how the database connection string is put together and what the common fields do.
keywords: [go-admin config file, gin database config, mysql connection string config]
---

## Config File Overview

Using go-admin for the first time needs one round of initial setup, mainly the database connection. MySQL is recommended, or you can get going quickly with the SQLite demo database the repo ships with (some features, like code generation, aren't supported there).

Open `config/settings.yml` and focus on the `database` section:

```yml
settings:
  database:
    driver: mysql
    source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=5000ms
```

Swap the three parts of `source` for your own:

- `user` — the database username
- `password` — the database password
- `dbname` — the database name, which needs to exist beforehand

The remaining config sections (`application`, `jwt`, `logger`, `gen`, etc.) can stay at their defaults and things will run — the full field reference is in the [Config Reference](/en-US/configure/settings). **The current version has no `application.logpath` field** — the log path is `logger.path`.

:::warning
Before going to production, `jwt.secret` must be replaced with a random string (the default is `go-admin`), and `application.mode` must be set to `prod`. See the [Config Reference](/en-US/configure/settings) for details.

:::

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
