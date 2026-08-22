---
nav:
  title: Development
  order: 2
  second:
    title: Advanced
    order: 1
group:
  title: Development Patterns
  order: 4
title: First API Endpoint
order: 3
toc: content
description: Writing your first go-admin endpoint — route-registration rules, how path matching works and how parameters are written, with a complete example.
keywords: [go-admin first api, gin route registration, adding a go api endpoint]
---

## What This Page Covers

The previous page, [Hand-Written Pattern](/en-US/intro/advanced/bus), explained when you need to hand-write a Handler. This page walks through a minimal example end to end: writing the handler function, registering the route, and verifying it works.

:::info
This is the **hand-written pattern**'s path, meant to make clear how route registration and request matching work — knowledge that's useful regardless of which pattern you use.

If what you're building is standard single-table CRUD, you don't need to hand-write it like this — go straight to [Standard Module Development](/en-US/intro/advanced/standard-module), where a module only needs a model, dto and router file.

:::

## Writing the Handler Function

Create an `article.go` file in the `apis` directory:

```go
package apis

import (
    "github.com/gin-gonic/gin"
    "go-admin/common/apis"
)

type Article struct {
    apis.Api
}

// GetArticleList fetches the article list
func (e Article) GetArticleList(c *gin.Context) {
    err := e.MakeContext(c).Errors
    if err != nil {
        e.Logger.Error(err)
        return
    }
    e.OK("hello world！", "success")
}
```

`MakeContext` sets up the context, and `Errors` collects any errors from that setup — there's no parameter binding or database access here, so under normal conditions there won't be an error, but checking it is a habit worth keeping: in a real endpoint, this step often does surface a problem.

This is the smallest endpoint that compiles, but it's not reachable yet, since it hasn't been registered on any route.

## Registering the Route

In `go-admin/app/admin/router/article.go`:

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

// route code that requires authentication
func registerArticleRouter(v1 *gin.RouterGroup, authMiddleware *jwt.GinJWTMiddleware) {
    api := apis.Article{}
    r := v1.Group("").Use(authMiddleware.MiddlewareFunc())
    {
        r.GET("/articleList", api.GetArticleList)
    }
}
```

`init()` runs automatically at program startup and adds `registerArticleRouter` to the list waiting to be registered — no need to register this one route by hand in any central file. This one is mounted behind `authMiddleware.MiddlewareFunc()`, so accessing it requires a login token; for unauthenticated or role-checked routes, see [Router Registration](/en-US/intro/advanced/router).

## Verify

```bash
go build
./go-admin server -c config/settings.yml
```

With a token obtained from logging in, visiting `http://localhost:8000/api/v1/articleList` should show:

```json
{
  "requestId": "4085aca9-1ea2-4088-8e26-8ba0bc4e8bdb",
  "code": 200,
  "msg": "success",
  "data": "hello world！"
}
```

:::warning
If you get `404 page not found`, first confirm you're requesting the full path `/api/v1/articleList` rather than the root path `/` — that's the most common cause.

A `401` means no valid token was sent — see [Authentication & Authorization](/en-US/intro/advanced/auth).

:::

## Route Matching Rules

`GET`, `POST`, `PUT` and `DELETE` are the most commonly used registration methods; each function's two required arguments are `path` and `handlers`.

### path

`path` is a rule for matching a URL. When a request comes in, it's matched against registered routes in order, and the first match wins.

These rules don't match GET or POST parameters, or the domain. For example, handling a request to `https://example.com/articleList` only tries to match `articleList`; handling `https://example.com/articleList?page=3` also only tries to match `articleList` — `?page=3` plays no part in matching.

`path` also supports parameters, e.g. `r.GET("/articleList/:id", apis.GetArticleList)`, which matches against `/articleList/:id`, where `:id` can be a string, a number, or any other character, and can optionally be constrained further — not covered here.

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
