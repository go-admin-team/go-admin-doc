---
nav:
  title: 开发
  order: 2
  second:
    title: 进阶
    order: 1
group:
  title: 开发模式
  order: 4
title: 第一个接口
order: 3
toc: content
description: go-admin 编写第一个接口：路由注册规则、path 匹配方式与参数写法，含完整示例。
keywords: [go-admin 第一个接口, gin 路由注册, go 新增 api 接口]
---

## 这篇讲什么

上一篇[常规模式](/intro/advanced/bus)说明了什么时候需要手写 Handler。这篇通过一个最小的例子，走一遍手写接口的完整链路：写处理函数、注册路由、启动验证。

:::info
这是**手写模式**的路径，目的是讲清楚路由注册与请求匹配的机制——这部分知识无论用哪种模式都用得上。

如果要做的是标准的单表增删改查，不需要照这篇手写，直接看 [标准模块开发](/intro/advanced/standard-module)，一个模块只需要 model、dto、router 三个文件。

:::

## 编写接口处理函数

在 `apis` 目录中创建 `article.go` 文件：

```go
package apis

import (
    "github.com/gin-gonic/gin"
    "go-admin/common/apis"
)

type Article struct {
    apis.Api
}

// GetArticleList 获取文章列表
func (e Article) GetArticleList(c *gin.Context) {
    err := e.MakeContext(c).Errors
    if err != nil {
        e.Logger.Error(err)
        return
    }
    e.OK("hello world！", "success")
}
```

`MakeContext` 完成上下文初始化，`Errors` 收集初始化过程中的错误——这里没有绑定参数或访问数据库，所以正常情况下不会有错误，但检查它是习惯，实际接口中这一步经常会有问题。

这是能编译的最小接口，但还访问不到，因为它还没有被注册到任何路由上。

## 注册路由

在 `go-admin/app/admin/router/article.go` 中：

```go
package router

import (
    "go-admin/app/admin/apis"

    "github.com/gin-gonic/gin"
    jwt "github.com/go-admin-team/go-admin-core/sdk/pkg/jwtauth"
)

func init() {
    routerCheckRole = append(routerCheckRole, registerArticleRouter)
}

// 需认证的路由代码
func registerArticleRouter(v1 *gin.RouterGroup, authMiddleware *jwt.GinJWTMiddleware) {
    api := apis.Article{}
    r := v1.Group("").Use(authMiddleware.MiddlewareFunc())
    {
        r.GET("/articleList", api.GetArticleList)
    }
}
```

`init()` 会在程序启动时自动执行，把 `registerArticleRouter` 加入待注册列表——不需要在任何中心文件里手工登记这一个路由。这里挂了 `authMiddleware.MiddlewareFunc()`,访问需要登录 token；免认证或角色鉴权的写法见[路由注册](/intro/advanced/router)。

## 验证

```bash
go build
./go-admin server -c config/settings.yml
```

带上登录后拿到的 token 访问 `http://localhost:8000/api/v1/articleList`,应该看到：

```json
{
  "requestId": "4085aca9-1ea2-4088-8e26-8ba0bc4e8bdb",
  "code": 200,
  "msg": "success",
  "data": "hello world！"
}
```

:::warning
访问返回 `404 page not found` 时，先确认请求的是完整路径 `/api/v1/articleList`,而不是根路径 `/`——这是最常见的原因。

返回 `401` 则是没有携带有效 token，见[认证与鉴权](/intro/advanced/auth)。

:::

## 路由匹配规则

`GET`、`POST`、`PUT`、`DELETE` 是最常用的几种注册方式，每个函数的两个必须参数是 `path` 和 `handlers`。

### path

`path` 是一个匹配 URL 的准则，请求进来时按注册顺序依次匹配，命中第一个符合的即返回。

这些准则不会匹配 GET 和 POST 参数或域名。例如处理请求 `https://example.com/articleList` 时，只会尝试匹配 `articleList`；处理请求 `https://example.com/articleList?page=3` 时，同样只会尝试匹配 `articleList`,`?page=3` 不参与匹配。

`path` 也支持带参数的写法，例如 `r.GET("/articleList/:id", apis.GetArticleList)`,这时会按 `/articleList/:id` 匹配，`:id` 可以是字符串、数字等任意字符，也可以加以限制，这里不再展开。

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
