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
title: Router Registration
toc: content
order: 5
description: go-admin router registration — the difference between the authenticated and unauthenticated registration slices, naming conventions, and how the login and role-check middleware combine.
keywords: [go-admin router registration, gin route grouping, gin middleware authorization, jwt route protection]
---

# Router Registration

Routing maps a URL to a handler, and decides which middleware that endpoint needs — whether login is required, whether role checks apply, whether data-permission scoping is injected.

go-admin's routes self-register through `init()` — there's no need to register anything by hand in a central file.

:::info
**Every module needs this layer**, whether it uses the [Actions Pattern](/en-US/intro/advanced/advanced) or the [Hand-Written Pattern](/en-US/intro/advanced/bus). The two patterns register routes differently: the former hangs a generic Action directly on the route, the latter calls a handler you wrote yourself.

:::
## package and import

```go
package router

import (
	"github.com/gin-gonic/gin"
	jwt "github.com/go-admin-team/go-admin-core/sdk/pkg/jwtauth"
	"go-admin/app/admin/apis"
	"go-admin/common/middleware"
)
```

## Registering Routes

| Method | Description |
| ------------------------ | ----------------------------------------- |
| init                     | the package's init function |
| registerSyPostRouter     | route registration — the built-in generic naming pattern go-admin uses |

:::warning
go-admin's route registration function naming convention:
Format: `register{BusinessName}Router`

If you're registering routes outside the code generator, follow this format.
:::

```go
func init() {
	routerCheckRole = append(routerCheckRole, registerSyPostRouter)
}

// Route code that requires authentication
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

The code above uses two middlewares:

1. authMiddleware
1. AuthCheckRole

So why these two?

Most systems need some level of security or permission control on their endpoints. These two middlewares handle that: one for login authentication, the other for role-based authorization.

## Login Authentication Only

For endpoints that only need to confirm the caller is logged in, use just the `authMiddleware` middleware:

For example:

```go
func init() {
	routerCheckRole = append(routerCheckRole, registerSyPostRouter)
}

// Route code that requires authentication
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

## Role-Based Authorization

For endpoints that need finer-grained permission control, combine both middlewares — `authMiddleware` and `AuthCheckRole`:

For example:

```go
func init() {
	routerCheckRole = append(routerCheckRole, registerSyPostRouter)
}

// Route code that requires authentication
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

## No Authorization Required

For endpoints that can be accessed anonymously, use neither `authMiddleware` nor `AuthCheckRole`:

For example:

```go
func init() {
	routerNoCheckRole = append(routerNoCheckRole, registerSyPostRouter)
}

// Route code that does not require authentication
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
Note the difference between the two registration slices (defined in `app/admin/router/router.go`):

- `routerCheckRole`: authenticated routes, function signature `func(v1 *gin.RouterGroup, authMiddleware *jwt.GinJWTMiddleware)`
- `routerNoCheckRole`: unauthenticated routes, function signature `func(v1 *gin.RouterGroup)`

A route that needs no authorization must be registered to `routerNoCheckRole` — otherwise it still gets folded into the authenticated group's traversal.

:::

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
