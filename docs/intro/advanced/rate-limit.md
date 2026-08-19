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
title: 限流
order: 8
toc: content
description: go-admin 限流：基于 Sentinel 的全局限流如何配置与触发，触发后的响应内容，如何调整阈值或关闭限流，以及一个仍未修复的并发崩溃问题。
keywords: [go-admin 限流, sentinel-golang, gin 限流中间件, QPS 限流]
---

# 限流

go-admin 基于阿里巴巴的 [Sentinel](https://github.com/alibaba/sentinel-golang) 实现了一道全局限流，防止突发流量把服务打垮。

## 当前的限流规则

限流在 `common/middleware/sentinel.go` 中定义，并在 `cmd/api/server.go` 里对**所有路由**全局生效：

```go
func Sentinel() gin.HandlerFunc {
    system.LoadRules([]*system.Rule{
        {
            MetricType:   system.InboundQPS,
            TriggerCount: 200,
            Strategy:     system.BBR,
        },
    })
    return sentinel.SentinelMiddleware(
        sentinel.WithBlockFallback(func(ctx *gin.Context) {
            ctx.AbortWithStatusJSON(200, map[string]interface{}{
                "msg":  "too many request; the quota used up!",
                "code": 500,
            })
        }),
    )
}
```

规则是固定的：整个服务的入站 QPS 超过 200 时，Sentinel 按自适应策略（BBR）开始拒绝部分请求，而不是简单的"超过阈值就全部拒绝"。

## 触发限流后的响应

被限流的请求会收到：

```json
{
  "code": 500,
  "msg": "too many request; the quota used up!"
}
```

:::warning
HTTP 状态码是 **200**，不是 429 或 500。前端与客户端如果只按 HTTP 状态码判断成功失败，会把这次限流误判为成功——需要额外检查响应体中的 `code` 字段。

这与[统一响应](/intro/advanced/response)的返回格式不同：限流响应中没有 `requestId`，因为它发生在 Sentinel 中间件层，早于 `RequestId` 中间件填充上下文。

:::

## 调整阈值或关闭限流

**没有配置项能控制这道限流**——阈值、策略都是硬编码在 `common/middleware/sentinel.go` 中的，调整或关闭都需要改代码后重新编译：

- **调整阈值**：修改 `TriggerCount` 的值；
- **关闭限流**：在 `cmd/api/server.go` 中移除 `r.Use(common.Sentinel())` 这一行。

单机部署且并发量不大时，200 QPS 通常不会被触碰到。压测或多实例部署前建议评估这个阈值是否合适——它是针对单个进程设置的，多实例部署时总体可承受的流量会随实例数放大，但每个实例仍然各自按 200 QPS 限制。

## 已知问题：并发访问下可能崩溃

:::error
当前使用的 `sentinel-golang v1.0.4` 在高并发下存在崩溃问题，[issue #788](https://github.com/go-admin-team/go-admin/issues/788) 中有多人反馈，**截至目前仍未修复**。

现象是访问量上来后进程崩溃或疯狂刷日志，堆栈指向 `sentinel-golang` 内部的 `leap_array.go`，属于并发访问计数器时的问题，不是业务代码的错误。

如果生产环境遇到不明原因的崩溃且访问量较高，可以先按上一节的方法关闭限流，排除这个因素。

:::

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
