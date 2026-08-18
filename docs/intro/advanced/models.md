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
title: Model 定义
toc: content
order: 4
description: go-admin Model 定义：GORM 结构体、TableName 方法与公共字段的使用方式。
keywords: [go-admin model, gorm 模型定义, golang 数据库结构体]
---

models 主要是和 db 做交互使用的。

## package 和 import

首先，需要是`package`名称和 `import` package 引用关系

```go
package models

import (
	"go-admin/common/models"
)
```

## Table struct

```go
type SysPost struct {
	PostId   int    `gorm:"primaryKey;autoIncrement" json:"postId"` //岗位编号
	PostName string `gorm:"size:128;" json:"postName"`              //岗位名称
	PostCode string `gorm:"size:128;" json:"postCode"`              //岗位代码
	Sort     int    `gorm:"size:4;" json:"sort"`                    //岗位排序
	Status   int    `gorm:"size:4;" json:"status"`                  //状态
	Remark   string `gorm:"size:255;" json:"remark"`                //描述
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
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
