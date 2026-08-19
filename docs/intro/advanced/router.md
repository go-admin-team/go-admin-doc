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
title: 路由注册
toc: content
order: 5
description: go-admin 路由注册：需认证与免认证两类注册切片的区别、命名规范，以及登录鉴权与角色鉴权中间件的组合方式。
keywords: [go-admin 路由注册, gin 路由分组, gin 中间件 鉴权, jwt 路由保护]
---

# 路由注册

路由把 URL 映射到处理函数，并决定这个接口需要哪些中间件——是否要求登录、是否做角色鉴权、是否注入数据权限。

go-admin 的路由通过 `init()` 自注册，不需要在中心文件里手工登记。

:::info
**每个模块都需要这一层**，无论使用 [Actions 模式](/intro/advanced/advanced) 还是[常规模式](/intro/advanced/bus)。两种模式的路由写法不同：前者在路由中直接挂通用 Action，后者调用自己编写的 Handler。

:::
## package 与 import

```go
package router

import (
	"github.com/gin-gonic/gin"
	jwt "github.com/go-admin-team/go-admin-core/sdk/pkg/jwtauth"
	"go-admin/app/admin/apis"
	"go-admin/common/middleware"
)
```

## 路由注册

| 接口名称                 | 说明                                      |
| ------------------------ | ----------------------------------------- |
| init                     | 系统 init 函数                            |
| registerSyPostRouter     | 路由注册，go-admin 路由注册内置的通用函数 |

:::warning
go-admin 路由注册函数命名规范
格式：register{业务名称}Router

！！！如果在非代码生成模式下需要按照此格式进行命名定义。
:::

```go
func init() {
	routerCheckRole = append(routerCheckRole, registerSyPostRouter)
}

// 需认证的路由代码
func registerSyPostRouter(v1 *gin.RouterGroup, authMiddleware *jwt.GinJWTMiddleware) {
	api := apis.SysPost{}
	r := v1.Group("/post").Use(authMiddleware.MiddlewareFunc()).Use(middleware.AuthCheckRole())
	{
		r.GET("", api.GetPage)
		r.GET("/:id", api.Get)
		r.POST("", api.Insert)
		r.PUT("/:id", api.Update)
		r.DELETE("", api.Delete)
	}
}
```

上述代码中我们使用了两个中间件：

1. authMiddleware
1. AuthCheckRole

那么，为什么要使用这两个中间件呢？

通常系统使用中有些接口都有一些安全或者权限控制方面的考虑，那么我们这里的两个中间件分别控制用户登陆鉴权和角色权限鉴定；

## 登陆鉴权

在某种业务场景下，我们可能只需要登录鉴权，那么我们只需要使用其中一个中间件 `authMiddleware` 就好了；

例如：

```go
func init() {
	routerCheckRole = append(routerCheckRole, registerSyPostRouter)
}

// 需认证的路由代码
func registerSyPostRouter(v1 *gin.RouterGroup, authMiddleware *jwt.GinJWTMiddleware) {
	api := apis.SysPost{}
	r := v1.Group("/post").Use(authMiddleware.MiddlewareFunc())
	{
		r.GET("", api.GetPage)
		r.GET("/:id", api.Get)
		r.POST("", api.Insert)
		r.PUT("/:id", api.Update)
		r.DELETE("", api.Delete)
	}
}
```

## 角色鉴权

如果我们对权限的控制级别要求的比较高，那么我们需要两个中间件组合使用 `authMiddleware`，`AuthCheckRole` 了；

例如：

```go
func init() {
	routerCheckRole = append(routerCheckRole, registerSyPostRouter)
}

// 需认证的路由代码
func registerSyPostRouter(v1 *gin.RouterGroup, authMiddleware *jwt.GinJWTMiddleware) {
	api := apis.SysPost{}
	r := v1.Group("/post").Use(authMiddleware.MiddlewareFunc()).Use(middleware.AuthCheckRole())
	{
		r.GET("", api.GetPage)
		r.GET("/:id", api.Get)
		r.POST("", api.Insert)
		r.PUT("/:id", api.Update)
		r.DELETE("", api.Delete)
	}
}
```

## 无需鉴权

当然，如果接口可以匿名访问时，两个中间件`authMiddleware`，`AuthCheckRole` 都不使用即可；

例如：

```go
func init() {
	routerNoCheckRole = append(routerNoCheckRole, registerSyPostRouter)
}

// 无需认证的路由代码
func registerSyPostRouter(v1 *gin.RouterGroup) {
	api := apis.SysPost{}
	r := v1.Group("/post")
	{
		r.GET("", api.GetPage)
		r.GET("/:id", api.Get)
		r.POST("", api.Insert)
		r.PUT("/:id", api.Update)
		r.DELETE("", api.Delete)
	}
}
```

:::warning
注意两个注册切片的区别（定义见 `app/admin/router/router.go`）：

- `routerCheckRole`：需认证的路由，函数签名为 `func(v1 *gin.RouterGroup, authMiddleware *jwt.GinJWTMiddleware)`
- `routerNoCheckRole`：无需认证的路由，函数签名为 `func(v1 *gin.RouterGroup)`

无需鉴权的路由必须注册到 `routerNoCheckRole`，否则仍会被并入需认证路由组的遍历中。

:::

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
