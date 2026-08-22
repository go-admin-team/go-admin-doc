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
title: Service Layer
toc: content
order: 2
description: go-admin Service layer development — organising business logic, database operations and error handling, and the responsibility boundary with the API layer.
keywords: [go-admin service layer, golang business logic layering, gorm database operations]
---
# Service Layer

The Service layer carries business logic and is the only place that touches the database directly. It's called by the API layer and **never touches `gin.Context`** — anything request-related is parsed by the API layer and passed in.

:::info
**Single-table CRUD doesn't need this layer.** The generic Actions in `common/actions` already cover it, and a module only needs three files — model, dto, router. See [Standard Module Development](/en-US/intro/advanced/standard-module).

This page is for logic that outgrows single-table CRUD — cross-table transactions, calls to external services, complex validation.

:::

## import

```go
package service

import (
	"errors"

	"github.com/go-admin-team/go-admin-core/sdk/service"
	"gorm.io/gorm"

	"go-admin/app/admin/models"
	"go-admin/app/admin/service/dto"
	cDto "go-admin/common/dto"
)
```

## Defining the Business Struct

```go
type SysPost struct {
	service.Service
}
```

## GetList

GetList handles the business logic for the paginated list endpoint, using the related dto and models functions.

Example:

```go
// GetPage fetches the SysPost list
func (e *SysPost) GetPage(c *dto.SysPostPageReq, list *[]models.SysPost, count *int64) error {
	var err error
	var data models.SysPost

	err = e.Orm.Model(&data).
		Scopes(
			cDto.MakeCondition(c.GetNeedSearch()),
			cDto.Paginate(c.GetPageSize(), c.GetPageIndex()),
		).
		Find(list).Limit(-1).Offset(-1).
		Count(count).Error
	if err != nil {
		e.Log.Errorf("db error:%s \r", err)
		return err
	}
	return nil
}
```

## Get

Get handles the business logic for fetching a single record by ID, using the related dto and models functions.

Example:

```go
// Get fetches a SysPost object
func (e *SysPost) Get(d *dto.SysPostGetReq, model *models.SysPost) error {
	var err error
	var data models.SysPost

	db := e.Orm.Model(&data).
		First(model, d.GetId())
	err = db.Error
	if err != nil && errors.Is(err, gorm.ErrRecordNotFound) {
		err = errors.New("查看对象不存在或无权查看")
		e.Log.Errorf("db error:%s", err)
		return err
	}
	if db.Error != nil {
		e.Log.Errorf("db error:%s", err)
		return err
	}
	return nil
}
```

## Post

Post handles the business logic for creating a single record, using the related dto and models functions.

Example:

```go
// Insert creates a SysPost object
func (e *SysPost) Insert(c *dto.SysPostInsertReq) error {
	var err error
	var data models.SysPost
	c.Generate(&data)
	err = e.Orm.Create(&data).Error
	if err != nil {
		e.Log.Errorf("db error:%s", err)
		return err
	}
	return nil
}
```

## Put

Put handles the business logic for updating a single record, using the related dto and models functions.

Example:

```go
// Update modifies a SysPost object
func (e *SysPost) Update(c *dto.SysPostUpdateReq) error {
	var err error
	var model = models.SysPost{}
	e.Orm.First(&model, c.GetId())
	c.Generate(&model)

	db := e.Orm.Save(&model)
	if db.Error != nil {
		e.Log.Errorf("db error:%s", err)
		return err
	}
	if db.RowsAffected == 0 {
		return errors.New("无权更新该数据")

	}
	return nil
}
```

## Delete

Delete handles the business logic for deleting a single record, using the related dto and models functions.

Example:

```go
// Remove deletes a SysPost
func (e *SysPost) Remove(d *dto.SysPostDeleteReq) error {
	var err error
	var data models.SysPost

	db := e.Orm.Model(&data).Delete(&data, d.GetId())
	if db.Error != nil {
		err = db.Error
		e.Log.Errorf("Delete error: %s", err)
		return err
	}
	if db.RowsAffected == 0 {
		err = errors.New("无权删除该数据")
		return err
	}
	return nil
}
```

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
