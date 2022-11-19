---
nav: 开发
group:
  title: 高级
  order: 2
title: router
---

## package & import

```go
package router

import (
	"github.com/gin-gonic/gin"
	jwt "github.com/go-admin-team/go-admin-core/sdk/pkg/jwtauth"
	"go-admin/app/admin/apis/sys_file"
	"go-admin/common/middleware"
)
```

## 路由注册

| 接口名称                 | 说明                                      |
| ------------------------ | ----------------------------------------- |
| init                     | 系统 init 函数                            |
| registerSysFileDirRouter | 路由注册，go-admin 路由注册内置的通用函数 |

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
	routerCheckRole = append(routerCheckRole, registerSyPostRouter)
}

// 需认证的路由代码
func registerSyPostRouter(v1 *gin.RouterGroup, authMiddleware *jwt.GinJWTMiddleware) {
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
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
