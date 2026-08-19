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
title: 请求追踪
order: 4
toc: content
description: go-admin 请求追踪：X-Request-Id 如何生成与透传，如何用它把一次请求的响应结果和后端日志串起来，以及排查线上问题时的实际用法。
keywords: [go-admin 请求追踪, X-Request-Id, gin 链路追踪, requestId 排查]
---

# 请求追踪

一次请求出错后，前端拿到的往往只有一句"服务器错误"。要在后端一堆日志里找到对应的那几行，需要一个能把两边串起来的标识——这就是 `requestId`。

## 它是怎么生成的

请求进入时，`common/middleware/request_id.go` 中的 `RequestId` 中间件按下面的顺序取值：

1. 请求头 `X-Request-Id`（原样大小写）；
2. 请求头 `x-request-id`（小写）；
3. 都没有则生成一个新的 UUID。

取到的值会写回请求上下文，供后续所有中间件与业务代码使用。这意味着**上游网关或调用方可以自己传入 `X-Request-Id`**,go-admin 会沿用而不是覆盖——适合网关到后端全链路用同一个 ID 追踪的场景。

## 它出现在哪里

同一个 `requestId` 会出现在两个地方：

**响应体中**。无论成功还是失败，[统一响应](/intro/advanced/response) 都会带上它：

```json
{
  "code": 500,
  "msg": "查询失败",
  "requestId": "b7d3f1a2-3c4d-4e5f-8a9b-1c2d3e4f5a6b"
}
```

**每一行请求日志中**。Api 层的 `e.Logger`、Service 层的 `e.Log`（见[日志](/intro/advanced/logger)）都携带同一个值，字段名为小写的 `x-request-id`：

```
[INFO] x-request-id=b7d3f1a2-... 创建岗位成功, postId: 12
[ERROR] x-request-id=b7d3f1a2-... db error: connection refused
```

:::warning
`requestId` 目前**不会**作为响应头返回，只出现在响应体里。需要在响应头中读取它的场景（例如某些网关的日志采集约定），需要自行在中间件中补充 `c.Header("X-Request-Id", requestId)`。

:::

## 排查问题时怎么用

1. 从报错的响应体中取出 `requestId`；
2. 在服务器日志里搜索这个值，能看到该请求经过的每一步：参数校验、数据库操作、返回结果；
3. 一次请求的日志被完整串起来后，通常能直接看出卡在哪一步。

这比只看"最后一条错误日志"更可靠——一次请求可能经过多层调用，只看报错那一行经常缺上下文。

反馈问题给他人（无论是提交 issue 还是团队内部沟通）时，**附上 `requestId` 比贴一段报错信息更有效**——对方可以直接凭它去查日志，而不需要靠时间点去猜是哪一次请求。

## 在业务代码中使用

需要在非 Api/Service 的位置（例如队列消费函数）获取当前请求的 ID，可以调用：

```go
requestId := pkg.GenerateMsgIDFromContext(c)
```

需要携带同样字段自定义打印日志时，构造一个带该字段的 logger：

```go
log := logger.NewHelper(sdk.Runtime.GetLogger()).WithFields(map[string]interface{}{
    "x-request-id": requestId,
})
```

多数情况下不需要这样做——直接使用 Api/Service 自带的 `e.Logger` / `e.Log` 已经带了这个字段。

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
