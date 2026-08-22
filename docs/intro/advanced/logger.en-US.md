---
nav:
  title: Development
  order: 2
  second:
    title: Advanced
    order: 1
group:
  title: Advanced Capabilities
  order: 7
title: Logging
order: 3
toc: content
description: Logging in go-admin — the difference between global and request-scoped logging, how to use each in the Api and Service layers, configuring log level and output location, and what to watch for when logging.
keywords: [go-admin logging, golang logging, gin request logging, log level configuration]
---

# Logging

go-admin's logging comes from go-admin-core and splits into two uses: **global logging** and **request-scoped logging**. The difference is whether a log line can be tied back to a specific request.

## Request-Scoped Logging (recommended)

In the Api and Service layers, prefer the logger the struct already carries. It's built from the request context, so its output carries that request's tracing info (see [Request Tracing](/en-US/intro/advanced/tracing)) — useful for stringing together every log line from one request when tracking down a problem.

In the Api layer, via `e.Logger`:

```go
func (e SysPost) Insert(c *gin.Context) {
    err := e.MakeContext(c).MakeOrm().Bind(&req).Errors
    if err != nil {
        e.Logger.Error(err)
        e.Error(500, err, err.Error())
        return
    }
    e.Logger.Infof("post created, postId: %d", req.PostId)
}
```

In the Service layer, via `e.Log`:

```go
func (e *SysPost) Insert(c *dto.SysPostControl) error {
    var data models.SysPost
    c.Generate(&data)
    if err := e.Orm.Create(&data).Error; err != nil {
        e.Log.Errorf("db error: %s", err)
        return err
    }
    return nil
}
```

`Logger` and `Log` are initialised during `MakeContext` and `MakeService` respectively — just use them directly.

## Global Logging

Places outside the request flow — startup logic, scheduled jobs, queue consumer functions — have no request context, so they use the global logger:

```go
import log "github.com/go-admin-team/go-admin-core/logger"

log.Info("service started")
log.Infof("processed %d records", count)
log.Warnf("retry %d/%d", i, max)
log.Errorf("db create error, %s", err.Error())
```

Every level has an `f`-suffixed formatted variant.

## Log Level

Level is controlled by `logger.level` in the config file, from lowest to highest: `trace`, `debug`, `info`, `warn`, `error`, `fatal`. Only log lines at or above the configured level are emitted.

A general guide for picking a level:

| Level | For |
| --- | --- |
| `debug` | Intermediate state while debugging; usually off in production |
| `info` | Normal business actions, like "order created" |
| `warn` | Doesn't break the flow but worth noting — a retry, a fallback |
| `error` | An operation failed and needs a human's attention |

:::warning
The `level` in the repository's own config file is `trace`, which emits a large volume of logs. **Set it to `info` or higher in production**, or the log files grow fast and genuinely important errors get buried.

:::

## Output Location

Decided jointly by `logger.path` and `logger.stdout`:

- when `stdout` is empty, logs are written to the directory `path` points at;
- when `stdout` has any non-empty value, logs go to the console **instead of** a file.

Containerised deployments typically route logs to the console and let the container runtime collect them centrally. See [Config Reference](/en-US/configure/settings) for the fields.

## Things to Watch For

:::warning
**Don't log sensitive information.** Database connection strings, `jwt.secret`, user passwords, tokens — none of these belong in a log line. Log files are usually under looser access control than config files, and are often shipped to a third-party platform.

The same caution applies to logging request parameters — a login endpoint's parameters include the password.

:::

Keep the original error (`err.Error()`) when logging a failure; a bare "operation failed" leaves nothing to go on when debugging. Avoid logging heavily inside a loop too — aggregate first if you need to.

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
