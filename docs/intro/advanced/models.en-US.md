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
title: Model Definitions
toc: content
order: 4
description: go-admin Model definitions — the GORM struct, the TableName method, and how the common fields are used.
keywords: [go-admin model, gorm model definition, golang database struct]
---
# Model Definitions

A Model is a GORM struct describing a table's schema and field mapping — it's the vehicle for database interaction.

:::info
**Every module needs this layer**, whether it uses the [Actions Pattern](/en-US/intro/advanced/advanced) or the [Hand-Written Pattern](/en-US/intro/advanced/bus).

:::
## package and import

Grouped in three blocks: standard library, third-party, project-internal:

```go
package models

import (
	"go-admin/common/models"
)
```

## The Table Struct

```go
type SysPost struct {
	PostId   int    `gorm:"primaryKey;autoIncrement" json:"postId"` // post ID
	PostName string `gorm:"size:128;" json:"postName"`              // post name
	PostCode string `gorm:"size:128;" json:"postCode"`              // post code
	Sort     int    `gorm:"size:4;" json:"sort"`                    // sort order
	Status   int    `gorm:"size:4;" json:"status"`                  // status
	Remark   string `gorm:"size:255;" json:"remark"`                // remark
	models.ControlBy
	models.ModelTime

	DataScope string `gorm:"-" json:"dataScope"`
	Params    string `gorm:"-" json:"params"`
}

func (SysPost) TableName() string {
	return "sys_post"
}

func (e *SysPost) Generate() models.ActiveRecord {
	o := *e
	return &o
}

func (e *SysPost) GetId() interface{} {
	return e.PostId
}
```

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
