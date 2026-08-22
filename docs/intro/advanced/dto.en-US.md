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
title: DTO Definitions
toc: content
order: 3
description: go-admin DTO definitions — the three DTO shapes for list queries, create/update and by-ID operations, and how search conditions and validation tags are used.
keywords: [go-admin dto, golang parameter validation, gin request param struct, go query condition construction]
---
# DTO Definitions

A DTO (Data Transfer Object) describes the data a request carries: fields, validation rules, and the search conditions for a list query. A request is received and validated by its DTO before moving further into the code.

go-admin has three DTO shapes: `Search` for list queries, `Control` for create/update, and `ById` for by-ID operations.

:::info
**Every module needs this layer**, whether it uses the [Actions Pattern](/en-US/intro/advanced/advanced) or the [Hand-Written Pattern](/en-US/intro/advanced/bus).

:::
## Import

```go
package dto

import (
	"go-admin/app/admin/models"
	common "go-admin/common/models"

	"go-admin/common/dto"
)
```

## The Search Struct

First declare the properties a search request accepts, then list them out one by one.

| Method | Description |
| --- | --- |
| GetNeedSearch | Implements the GORM scope |

Example:

```go
// SysPostPageReq is used for list/search requests
type SysPostPageReq struct {
	dto.Pagination `search:"-"`
	PostId         int    `form:"postId" search:"type:exact;column:post_id;table:sys_post" comment:"id"`        // id
	PostName       string `form:"postName" search:"type:contains;column:post_name;table:sys_post" comment:"名称"` // name
	PostCode       string `form:"postCode" search:"type:contains;column:post_code;table:sys_post" comment:"编码"` // code
	Sort           int    `form:"sort" search:"type:exact;column:sort;table:sys_post" comment:"排序"`             // sort order
	Status         int    `form:"status" search:"type:exact;column:status;table:sys_post" comment:"状态"`         // status
	Remark         string `form:"remark" search:"type:exact;column:remark;table:sys_post" comment:"备注"`         // remark
}

func (m *SysPostPageReq) GetNeedSearch() interface{} {
	return *m
}
```

### struct Tags

Covering just the `search` tag's own content:

| Tag | Description |
| --------- | -------------- |
| type      | operation type |
| column    | the database column name |
| table     | the database table name |

### type Values

| type                   | Meaning          | Query example          |
| :--------------------- | :------------ | :-------------------- |
| exact/iexact           | equals          | status=1              |
| glt    | not equals           | postName<>1            |
| contains/icontanins    | contains          | name=n                |
| gt/gte                 | greater than / greater than or equal | age=18                |
| lt/lte                 | less than / less than or equal | age=18                |
| startswith/istartswith | starts with       | content=hell          |
| endswith/iendswith     | ends with       | content=world         |
| in                     | in-list query       | status=0&status=1 |
| isnull                 | is-null query   | startTime=1           |
| order                  | sort order          | sort=asc/sort=desc    |
| join                   | join         | -                     |

Example:

```go
type ApplicationQuery struct {
	Id       string    `search:"type:icontains;column:id;table:receipt" form:"id"`
	Domain   string    `search:"type:icontains;column:domain;table:receipt" form:"domain"`
	Version  string    `search:"type:exact;column:version;table:receipt" form:"version"`
	Status   []int     `search:"type:in;column:status;table:receipt" form:"status"`
	Start    time.Time `search:"type:gte;column:created_at;table:receipt" form:"start"`
	End      time.Time `search:"type:lte;column:created_at;table:receipt" form:"end"`
	TestJoin `search:"type:left;on:id:receipt_id;table:receipt_goods;join:receipts"`
	ApplicationOrder
}
type ApplicationOrder struct {
	IdOrder string `search:"type:order;column:id;table:receipt" form"id_order"`
}

type TestJoin struct {
	PaymentAccount string `search:"type:icontains;column:payment_account;table:receipts" form:"payment_account"`
}
```

## The Insert Struct

| Method | Description |
| -------- | ---------------- |
| Generate | maps into the model |
| GetId    | returns the record's id |

```go
// SysPostInsertReq is used for create requests
type SysPostInsertReq struct {
	PostId   int    `uri:"id"  comment:"id"`
	PostName string `form:"postName"  comment:"名称"`
	PostCode string `form:"postCode" comment:"编码"`
	Sort     int    `form:"sort" comment:"排序"`
	Status   int    `form:"status"   comment:"状态"`
	Remark   string `form:"remark"   comment:"备注"`
	common.ControlBy
}

func (s *SysPostInsertReq) Generate(model *models.SysPost) {
	model.PostName = s.PostName
	model.PostCode = s.PostCode
	model.Sort = s.Sort
	model.Status = s.Status
	model.Remark = s.Remark
	if s.ControlBy.UpdateBy != 0 {
		model.UpdateBy = s.UpdateBy
	}
	if s.ControlBy.CreateBy != 0 {
		model.CreateBy = s.CreateBy
	}
}

// GetId returns the record's ID
func (s *SysPostInsertReq) GetId() interface{} {
	return s.PostId
}
```

## The Update Struct

| Method | Description |
| -------- | ---------------- |
| Generate | maps into the model |
| GetId    | returns the record's id |

```go
// SysPostUpdateReq is used for update requests
type SysPostUpdateReq struct {
	PostId   int    `uri:"id"  comment:"id"`
	PostName string `form:"postName"  comment:"名称"`
	PostCode string `form:"postCode" comment:"编码"`
	Sort     int    `form:"sort" comment:"排序"`
	Status   int    `form:"status"   comment:"状态"`
	Remark   string `form:"remark"   comment:"备注"`
	common.ControlBy
}

func (s *SysPostUpdateReq) Generate(model *models.SysPost) {
	model.PostId = s.PostId
	model.PostName = s.PostName
	model.PostCode = s.PostCode
	model.Sort = s.Sort
	model.Status = s.Status
	model.Remark = s.Remark
	if s.ControlBy.UpdateBy != 0 {
		model.UpdateBy = s.UpdateBy
	}
	if s.ControlBy.CreateBy != 0 {
		model.CreateBy = s.CreateBy
	}
}

func (s *SysPostUpdateReq) GetId() interface{} {
	return s.PostId
}
```

## The Get Struct

| Method | Description |
| -------- | ---------------- |
| GetId    | returns the record's id |

```go
// SysPostGetReq is used to fetch a single record
type SysPostGetReq struct {
	Id int `uri:"id"`
}

func (s *SysPostGetReq) GetId() interface{} {
	return s.Id
}
```

## The Delete Struct

| Method | Description |
| -------- | ---------------- |
| Generate | maps into the model |
| GetId    | returns the record's id |

```go
// SysPostDeleteReq is used for delete requests
type SysPostDeleteReq struct {
	Ids []int `json:"ids"`
	common.ControlBy
}

func (s *SysPostDeleteReq) Generate(model *models.SysPost) {
	if s.ControlBy.UpdateBy != 0 {
		model.UpdateBy = s.UpdateBy
	}
	if s.ControlBy.CreateBy != 0 {
		model.CreateBy = s.CreateBy
	}
}

func (s *SysPostDeleteReq) GetId() interface{} {
	return s.Ids
}
```

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
