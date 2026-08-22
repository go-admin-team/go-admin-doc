---
nav:
  title: Development
  order: 2
  second:
    title: Advanced
    order: 1
group:
  title: Layered Development
  order: 5
title: Response Format
order: 9
toc: content
description: go-admin's response format — how the four methods OK, PageOK, Error and Custom work and what they return, what requestId is for, and the convention around error codes and error messages.
keywords: [go-admin response format, gin unified response, golang api response wrapper, requestId tracing]
---

# Response Format

Every go-admin endpoint returns the same shape, so the frontend can handle success and failure uniformly instead of writing separate parsing logic per endpoint.

Call `e.OK`, `e.PageOK` or `e.Error` directly from the API layer — no need to assemble a `gin.H` yourself.

## The Response Shape

A success response:

```json
{
  "code": 200,
  "data": { },
  "msg": "查询成功",
  "requestId": "b7d3f1a2-..."
}
```

A failure response:

```json
{
  "code": 500,
  "msg": "查询失败",
  "requestId": "b7d3f1a2-..."
}
```

`requestId` is filled in automatically by the framework and matches the trace ID in the logs. Ask for this value when a user reports a problem — it's enough to find that exact request in the logs. See [Request Tracing](/en-US/intro/advanced/tracing).

## The Four Methods

### OK — Return a Single Result

```go
e.OK(data, "查询成功")
```

The first argument is any data; the second is the message shown to the caller.

### PageOK — Return a Paginated List

```go
e.PageOK(list, int(count), req.GetPageIndex(), req.GetPageSize(), "查询成功")
```

The returned `data` carries both the list and the pagination info:

```json
{
  "code": 200,
  "data": {
    "list": [],
    "count": 100,
    "pageIndex": 1,
    "pageSize": 10
  },
  "msg": "查询成功",
  "requestId": "b7d3f1a2-..."
}
```

`count` is the total matching the filter, used by the frontend to compute page count; the pagination values come straight from the request DTO, no parsing needed.

### Error — Return an Error

```go
e.Error(500, err, "查询失败")
```

Three arguments: the HTTP status code, the error object, and the message returned to the frontend.

:::warning
Note the precedence: **a non-empty `msg` overrides `err`.** In other words, `e.Error(500, err, "查询失败")` sends "查询失败" to the frontend, not `err.Error()`.

This is deliberate — database errors and raw SQL fragments shouldn't be exposed to the frontend directly. Log the detail instead when you need to keep it:

```go
if err != nil {
    e.Logger.Errorf("查询失败: %s", err.Error())
    e.Error(500, err, "查询失败")
    return
}
```

:::

Pass an empty string and `err.Error()` is used as the message instead — only do this when the underlying error text is actually fit to show a user (a validation message, say).

### Custom — Return a Custom Shape

For the rare case where you need to return something outside this shape (matching a third-party format, say):

```go
e.Custom(gin.H{
    "success": true,
    "anything": "...",
})
```

Avoid this unless you actually need it — the frontend's unified handling stops working for that response.

## Common Status Codes

| code | meaning |
| --- | --- |
| 200 | success |
| 401 | not authenticated — token missing or expired |
| 403 | authenticated but not authorized |
| 422 | validation failed |
| 500 | server error |

## Full Example

```go
func (e SysPost) GetPage(c *gin.Context) {
    req := dto.SysPostGetPageReq{}
    s := service.SysPost{}
    err := e.MakeContext(c).MakeOrm().Bind(&req, binding.Form).MakeService(&s.Service).Errors
    if err != nil {
        e.Logger.Error(err)
        e.Error(500, err, err.Error())
        return
    }

    p := actions.GetPermissionFromContext(c)
    list := make([]models.SysPost, 0)
    var count int64

    if err := s.GetPage(&req, p, &list, &count); err != nil {
        e.Error(500, err, "查询失败")
        return
    }
    e.PageOK(list, int(count), req.GetPageIndex(), req.GetPageSize(), "查询成功")
}
```

`Errors` on the chained call must be checked — a binding failure or a database connection failure both land here, and skipping the check means using an uninitialised object further down.

:::info
For a standard single-table CRUD module, none of this needs writing by hand — the generic Actions already call the matching response method internally. See [Standard Module Development](/en-US/intro/advanced/standard-module).

:::

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
