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
## 路由路径注册
app/ 目录下已经完成如下对应的模块文件
xiangmu
├── apis
│   └── xiangmu_user.go
├── models
│   └── xiangmu_user.go
├── router
│   ├── int_router.go
│   ├── xiangmu_user.go
│   └── router.go
└── service
    ├── dto
    │   └── xiangmu_user.go
    └── xiangmu_user.go
此时你需要的api接口还没有注册完成，会出现如下错误
```sh
$ curl "http://127.0.0.1:8000/api/v1/lantian-uslantian-user?pageIndex=1&pageSize=10&beginTime=&endTime="
404 page not found
```
接下来到cmd/api文件夹下创建xiangmu.go, 内容如下
```go
package api

import "go-admin/app/lantian/router"

func init() {
	//注册路由 fixme 其他应用的路由，在本目录新建文件放在init方法
	AppRouters = append(AppRouters, router.InitRouter)
}

```
此时路由注册完成，可以调用对应的接口