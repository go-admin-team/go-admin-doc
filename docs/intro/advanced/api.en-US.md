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
title: API Layer
order: 1
toc: content
description: go-admin API layer development — embedding api.Api, parameter binding and error checks, and the handler shape for paginated lists, detail, create, update and delete.
keywords: [go-admin api layer, gin handler pattern, golang api development, gin parameter binding]
---
# API Layer

go-admin's backend has four layers, and a request flows through them top to bottom:

```
Router      →  Api            →  Service        →  Model
Route setup     Param binding      Business logic     GORM struct
Middleware       Calls Service      DB operations       TableName()
```

The corresponding directories are `app/{module}/router|apis|service|models`, with DTOs under `service/dto`.

Two rules keep the layering meaningful, and crossing either one makes responsibilities blurry: **Api never touches the database directly, Service never touches `gin.Context`**.

The API layer is a Gin handler — it receives the HTTP request: binds and validates parameters, calls Service, returns the response.

:::info
**Single-table CRUD doesn't need this layer.** The generic Actions in `common/actions` already cover it, and a module only needs three files — model, dto, router. See [Standard Module Development](/en-US/intro/advanced/standard-module).

This page is for logic that outgrows single-table CRUD — cross-table transactions, calls to external services, complex validation.

:::
## package and import

Grouped in three blocks: standard library, third-party, project-internal:

```go
package apis

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-admin-team/go-admin-core/sdk/api"
	"github.com/go-admin-team/go-admin-core/sdk/pkg/jwtauth/user"
	_ "github.com/go-admin-team/go-admin-core/sdk/pkg/response"

	"go-admin/app/admin/models"
	"go-admin/app/admin/service"
	"go-admin/app/admin/service/dto"
)
```

## struct

Create the struct for this API's business logic:

```go
type SysFileDir struct {
	apis.Api
}
```

---

:::warning
The handlers themselves

What follows are the actual handler functions. For plain CRUD, the code generator can produce all of this without writing a line by hand.

:::

## GetList

Paginated list endpoint:

```go
// GetPage
// @Summary Post list
// @Description Returns JSON
// @Tags Post
// @Param postName query string false "postName"
// @Param postCode query string false "postCode"
// @Param postId query string false "postId"
// @Param status query string false "status"
// @Success 200 {object} response.Response "{"code": 200, "data": [...]}"
// @Router /api/v1/post [get]
// @Security Bearer
func (e SysPost) GetPage(c *gin.Context) {
	// instantiate the service
	s := service.SysPost{}
	// instantiate the request object
	req :=dto.SysPostPageReq{}
	err := e.MakeContext(c).
		MakeOrm().
		Bind(&req, binding.Form).  // bind the request data
		MakeService(&s.Service).   // initialise the service
		Errors
	if err != nil {
		e.Logger.Error(err)
		e.Error(500, err, err.Error())
		return
	}

	list := make([]models.SysPost, 0)
	var count int64

	err = s.GetPage(&req, &list, &count)
	if err != nil {
		e.Error(500, err, "查询失败")
		return
	}

	e.PageOK(list, int(count), req.GetPageIndex(), req.GetPageSize(), "查询成功")
}
```

## Get

Single-record detail endpoint:

```go
// Get
// @Summary Get post info
// @Description Returns JSON
// @Tags Post
// @Param id path int true "id"
// @Success 200 {object} response.Response "{"code": 200, "data": [...]}"
// @Router /api/v1/post/{postId} [get]
// @Security Bearer
func (e SysPost) Get(c *gin.Context) {
	s := service.SysPost{}
	req :=dto.SysPostGetReq{}
	err := e.MakeContext(c).
		MakeOrm().
		Bind(&req, nil).
		MakeService(&s.Service).
		Errors
	if err != nil {
		e.Logger.Error(err)
		e.Error(500, err, err.Error())
		return
	}
	var object models.SysPost

	err = s.Get(&req, &object)
	if err != nil {
		e.Error(500, err, fmt.Sprintf("岗位信息获取失败！错误详情：%s", err.Error()))
		return
	}

	e.OK(object, "查询成功")
}
```

## Post

Create endpoint:

```go
// Insert
// @Summary Add a post
// @Description Returns JSON
// @Tags Post
// @Accept  application/json
// @Product application/json
// @Param data body dto.SysPostInsertReq true "data"
// @Success 200 {object} response.Response "{"code": 200, "data": [...]}"
// @Router /api/v1/post [post]
// @Security Bearer
func (e SysPost) Insert(c *gin.Context) {
	s := service.SysPost{}
	req :=dto.SysPostInsertReq{}
	err := e.MakeContext(c).
		MakeOrm().
		Bind(&req, binding.JSON).
		MakeService(&s.Service).
		Errors
	if err != nil {
		e.Logger.Error(err)
		e.Error(500, err, err.Error())
		return
	}
	req.SetCreateBy(user.GetUserId(c))
	err = s.Insert(&req)
	if err != nil {
		e.Error(500, err, fmt.Sprintf("新建岗位失败！错误详情：%s", err.Error()))
		return
	}
	e.OK(req.GetId(), "创建成功")
}
```

## Put

Update endpoint:

```go
// Update
// @Summary Update a post
// @Description Returns JSON
// @Tags Post
// @Accept  application/json
// @Product application/json
// @Param data body dto.SysPostUpdateReq true "body"
// @Success 200 {object} response.Response "{"code": 200, "data": [...]}"
// @Router /api/v1/post/{id} [put]
// @Security Bearer
func (e SysPost) Update(c *gin.Context) {
	s := service.SysPost{}
	req :=dto.SysPostUpdateReq{}
	err := e.MakeContext(c).
		MakeOrm().
		Bind(&req, binding.JSON, nil).
		MakeService(&s.Service).
		Errors
	if err != nil {
		e.Logger.Error(err)
		e.Error(500, err, err.Error())
		return
	}

	req.SetUpdateBy(user.GetUserId(c))

	err = s.Update(&req)
	if err != nil {
		e.Error(500, err, fmt.Sprintf("岗位更新失败！错误详情：%s", err.Error()))
		return
	}
	e.OK(req.GetId(), "更新成功")
}
```

## Delete

Delete endpoint:

```go
// Delete
// @Summary Delete a post
// @Description Deletes data
// @Tags Post
// @Param id body dto.SysPostDeleteReq true "request body"
// @Success 200 {object} response.Response "{"code": 200, "data": [...]}"
// @Router /api/v1/post [delete]
// @Security Bearer
func (e SysPost) Delete(c *gin.Context) {
	s := service.SysPost{}
	req :=dto.SysPostDeleteReq{}
	err := e.MakeContext(c).
		MakeOrm().
		Bind(&req, binding.JSON).
		MakeService(&s.Service).
		Errors
	if err != nil {
		e.Logger.Error(err)
		e.Error(500, err, err.Error())
		return
	}
	req.SetUpdateBy(user.GetUserId(c))
	err = s.Remove(&req)
	if err != nil {
		e.Error(500, err, fmt.Sprintf("岗位删除失败！错误详情：%s", err.Error()))
		return
	}
	e.OK(req.GetId(), "删除成功")
}
```

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
