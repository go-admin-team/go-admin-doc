# models

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
