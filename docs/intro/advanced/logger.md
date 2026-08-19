---
nav:
  title: 开发
  order: 2
  second:
    title: 进阶
    order: 1
group:
  title: 进阶能力
  order: 7
title: 日志
order: 2
toc: content
description: go-admin 日志使用：全局日志与请求上下文日志的区别、在 Api 与 Service 层中的写法、日志级别与输出位置的配置，以及记录日志时的注意事项。
keywords: [go-admin 日志, golang 日志记录, gin 请求日志, 日志级别配置]
---

# 日志

go-admin 的日志由 go-admin-core 提供，分为两种用法：**全局日志**与**请求上下文日志**。两者的差别在于日志能否关联到具体的请求。

## 请求上下文日志（推荐）

在 Api 与 Service 层中，优先使用结构体自带的 logger。它由请求上下文构造，输出时会带上该请求的追踪信息，排查问题时可以把一次请求的所有日志串起来。

Api 层通过 `e.Logger` 使用：

```go
func (e SysPost) Insert(c *gin.Context) {
    err := e.MakeContext(c).MakeOrm().Bind(&req).Errors
    if err != nil {
        e.Logger.Error(err)
        e.Error(500, err, err.Error())
        return
    }
    e.Logger.Infof("创建岗位成功, postId: %d", req.PostId)
}
```

Service 层通过 `e.Log` 使用：

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

`Logger` 与 `Log` 分别在 `MakeContext` 与 `MakeService` 时完成初始化，直接使用即可。

## 全局日志

不在请求流程内的位置——启动逻辑、定时任务、队列消费函数——没有请求上下文，使用全局日志：

```go
import log "github.com/go-admin-team/go-admin-core/logger"

log.Info("service started")
log.Infof("processed %d records", count)
log.Warnf("retry %d/%d", i, max)
log.Errorf("db create error, %s", err.Error())
```

每个级别都有带 `f` 后缀的格式化版本。

## 日志级别

级别由配置文件的 `logger.level` 控制，从低到高依次是 `trace`、`debug`、`info`、`warn`、`error`、`fatal`。只有不低于配置级别的日志才会输出。

选择级别时的一般判断：

| 级别 | 用于 |
| --- | --- |
| `debug` | 排查问题时的中间状态，生产环境通常关闭 |
| `info` | 正常的业务动作，如"订单已创建" |
| `warn` | 不影响流程但值得注意，如重试、降级 |
| `error` | 操作失败且需要人关注 |

:::warning
仓库自带的配置文件中 `level` 为 `trace`，会输出大量日志。**生产环境建议调整为 `info` 或更高**，否则日志文件增长很快，也会淹没真正需要关注的错误。

:::

## 输出位置

由 `logger.path` 与 `logger.stdout` 共同决定：

- `stdout` 留空时，日志写入 `path` 指定的目录；
- `stdout` 填写任意非空值时，日志输出到控制台，**不再写入文件**。

容器化部署时通常让日志走控制台，由容器运行时统一收集。配置项说明见[配置参考](/configure/settings)。

## 注意事项

:::warning
**不要把敏感信息写进日志。** 数据库连接串、`jwt.secret`、用户密码、token 都不应出现在日志中——日志文件的访问控制通常比配置文件宽松，也常被收集到第三方平台。

记录请求参数时同样需要注意，登录接口的参数中就包含密码。

:::

记录错误时保留原始错误信息（`err.Error()`），只写一句"操作失败"会让排查无从下手。同时避免在循环内打印大量日志，必要时先聚合再输出。

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
