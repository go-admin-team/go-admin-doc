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
title: Request Tracing
order: 4
toc: content
description: Request tracing in go-admin — how X-Request-Id is generated and propagated, how to use it to tie a response back to the backend logs that produced it, and how to actually use it when debugging an incident.
keywords: [go-admin request tracing, X-Request-Id, gin distributed tracing, requestId debugging]
---

# Request Tracing

When a request fails, the frontend usually gets nothing more than "server error". Finding the matching lines in a pile of backend logs needs an identifier that ties both sides together — that's `requestId`.

## How It's Generated

When a request comes in, the `RequestId` middleware in `common/middleware/request_id.go` resolves it in this order:

1. the `X-Request-Id` header (as sent);
2. the `x-request-id` header (lowercase);
3. if neither is present, a fresh UUID is generated.

Whatever value is resolved is written back into the request context for every later middleware and business-code path to use. That means **an upstream gateway or caller can supply its own `X-Request-Id`**, and go-admin will keep it rather than overwrite it — handy when a gateway-to-backend chain needs to trace with one consistent ID throughout.

## Where It Shows Up

The same `requestId` appears in two places:

**In the response body.** Whether the request succeeded or failed, the [Response Format](/en-US/intro/advanced/response) always carries it:

```json
{
  "code": 500,
  "msg": "query failed",
  "requestId": "b7d3f1a2-3c4d-4e5f-8a9b-1c2d3e4f5a6b"
}
```

**In every log line for that request.** The Api layer's `e.Logger` and the Service layer's `e.Log` (see [Logging](/en-US/intro/advanced/logger)) both carry the same value, under the lowercase field name `x-request-id`:

```
[INFO] x-request-id=b7d3f1a2-... post created, postId: 12
[ERROR] x-request-id=b7d3f1a2-... db error: connection refused
```

:::warning
`requestId` is currently **not** echoed back as a response header — it only appears in the body. If a scenario needs it in a response header (some gateway log-collection conventions expect that), add `c.Header("X-Request-Id", requestId)` in middleware yourself.

:::

## Using It to Debug

1. Pull `requestId` out of the failing response body;
2. search the server logs for that value — every step the request went through becomes visible: parameter validation, database operations, the final result;
3. with a request's logs strung together end to end, it's usually obvious right away where it got stuck.

This is more reliable than reading only "the last error line" — a request can cross several layers, and the single line where it failed often lacks the surrounding context.

When reporting a problem to someone else, whether filing an issue or talking to a teammate, **including `requestId` is more useful than pasting an error message** — the other person can go straight to the logs with it, instead of guessing which request you mean from a timestamp.

## Using It in Business Code

To get the current request's ID somewhere outside the Api/Service layers — a queue consumer function, for instance:

```go
requestId := pkg.GenerateMsgIDFromContext(c)
```

To print custom logs carrying the same field, build a logger with it attached:

```go
log := logger.NewHelper(sdk.Runtime.GetLogger()).WithFields(map[string]interface{}{
    "x-request-id": requestId,
})
```

Most of the time this isn't necessary — the Api/Service layer's own `e.Logger` / `e.Log` already carries this field.

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
