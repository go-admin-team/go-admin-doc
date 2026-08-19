---
nav:
  title: 开发
  order: 2
  second:
    title: 进阶
    order: 1
group:
  title: 分层开发
  order: 5
title: 统一响应
order: 9
toc: content
description: go-admin 接口响应格式：OK、PageOK、Error、Custom 四个方法的用法与返回结构，requestId 的作用，以及错误码与错误信息的处理约定。
keywords: [go-admin 响应格式, gin 统一返回, golang api 响应封装, requestId 追踪]
---

# 统一响应

go-admin 的所有接口返回同一种结构，前端因此可以统一处理成功与失败，不必为每个接口写不同的解析逻辑。

在 Api 层直接调用 `e.OK`、`e.PageOK`、`e.Error` 即可，不需要自己拼 `gin.H`。

## 返回结构

成功响应：

```json
{
  "code": 200,
  "data": { },
  "msg": "查询成功",
  "requestId": "b7d3f1a2-..."
}
```

失败响应：

```json
{
  "code": 500,
  "msg": "查询失败",
  "requestId": "b7d3f1a2-..."
}
```

`requestId` 由框架自动填入，与日志中的追踪 ID 一致。用户反馈问题时提供这个值，就能在日志里定位到那一次请求。

## 四个方法

### OK — 返回单个结果

```go
e.OK(data, "查询成功")
```

第一个参数是任意数据，第二个是提示信息。

### PageOK — 返回分页列表

```go
e.PageOK(list, int(count), req.GetPageIndex(), req.GetPageSize(), "查询成功")
```

返回结构中的 `data` 会包含列表与分页信息：

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

`count` 是符合条件的总数，用于前端计算页数；分页参数直接取自请求 DTO，不需要自己解析。

### Error — 返回错误

```go
e.Error(500, err, "查询失败")
```

三个参数分别是 HTTP 状态码、错误对象、返回给前端的提示信息。

:::warning
注意参数的优先级：**`msg` 非空时会覆盖 `err` 的内容**。也就是说 `e.Error(500, err, "查询失败")` 返回给前端的是"查询失败"，而不是 `err.Error()`。

这是刻意的设计——数据库报错、SQL 片段这类信息不应直接暴露给前端。需要保留细节时用日志记录：

```go
if err != nil {
    e.Logger.Errorf("查询失败: %s", err.Error())
    e.Error(500, err, "查询失败")
    return
}
```

:::

传入空字符串时才会使用 `err.Error()` 作为提示，仅建议在错误信息本身适合展示给用户时这样做（例如参数校验的提示）。

### Custom — 自定义结构

少数场景下需要返回不符合上述结构的内容（例如对接第三方约定的格式）：

```go
e.Custom(gin.H{
    "success": true,
    "anything": "...",
})
```

除非确有必要，否则不建议使用——前端的统一处理逻辑会失效。

## 常用状态码

| code | 含义 |
| --- | --- |
| 200 | 成功 |
| 401 | 未认证，token 缺失或已过期 |
| 403 | 已认证但无权限 |
| 422 | 参数校验失败 |
| 500 | 服务端错误 |

## 完整示例

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

其中链式调用后的 `Errors` 必须检查——参数绑定或数据库连接失败都会记录在这里，跳过检查会导致后续使用未初始化的对象。

:::info
如果模块是标准的单表增删改查，这些都不需要自己写：通用 Action 内部已经调用了对应的响应方法，见[标准模块开发](/intro/advanced/standard-module)。

:::

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
