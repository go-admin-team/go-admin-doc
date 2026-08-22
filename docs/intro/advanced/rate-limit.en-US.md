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
title: Rate Limiting
order: 8
toc: content
description: go-admin's rate limiting — how the global Sentinel-based limiter is configured and triggered, what the response looks like, how to adjust the threshold or turn it off, and a still-unfixed concurrency crash.
keywords: [go-admin rate limiting, sentinel-golang, gin rate limit middleware, QPS throttling]
---

# Rate Limiting

go-admin implements a global rate limiter on top of Alibaba's [Sentinel](https://github.com/alibaba/sentinel-golang), to keep a burst of traffic from taking the service down.

## The Current Rule

The limiter is defined in `common/middleware/sentinel.go` and applied globally, to **every route**, in `cmd/api/server.go`:

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

The rule is fixed: once the whole service's inbound QPS goes above 200, Sentinel starts rejecting some requests using an adaptive strategy (BBR) — not a simple "reject everything past the threshold".

## The Response When Rate-Limited

A throttled request gets:

```json
{
  "code": 500,
  "msg": "too many request; the quota used up!"
}
```

:::warning
The HTTP status code is **200**, not 429 or 500. A frontend or client that only checks the HTTP status to decide success or failure will read this as a success — it needs to also check the `code` field in the response body.

This differs from the [Response Format](/en-US/intro/advanced/response) used elsewhere: a rate-limited response carries no `requestId`, since it happens at the Sentinel middleware layer, before the `RequestId` middleware has populated the context.

:::

## Adjusting the Threshold or Turning It Off

**Nothing in the config controls this limiter** — the threshold and strategy are hardcoded in `common/middleware/sentinel.go`; adjusting or disabling it means changing the code and rebuilding:

- **Adjust the threshold**: change the `TriggerCount` value;
- **Turn it off**: remove the `r.Use(common.Sentinel())` line in `cmd/api/server.go`.

For a single-instance deployment with modest concurrency, 200 QPS is usually never reached. Before load testing or a multi-instance deployment, it's worth evaluating whether this threshold still fits — it's set per process, so the aggregate traffic a multi-instance deployment can absorb scales with the instance count, but each instance still enforces its own 200 QPS on its own.

## Known Issue: Possible Crash Under Concurrent Access

:::error
The pinned `sentinel-golang v1.0.4` has a crash under high concurrency, reported by several people in [issue #788](https://github.com/go-admin-team/go-admin/issues/788), **still unfixed as of now**.

The symptom is the process crashing or flooding the logs once traffic picks up, with the stack pointing into `sentinel-golang`'s internal `leap_array.go` — a concurrent-access counter issue, not a bug in the application code.

If production hits an unexplained crash under meaningful traffic, disabling the limiter as described above is a reasonable way to rule this out first.

:::

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
