# router

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

:::tip go-admin 路由注册函数命名规范
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
