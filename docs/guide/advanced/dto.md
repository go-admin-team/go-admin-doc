# dto

首先介绍以下 dto 在 go-admin 中的作用。dto 是一个数据接收模块，每一个请求进来，携带的数据需要在 dto 中进行处理验证；

## Import

```go
package dto

import (
	"go-admin/app/admin/models"
	common "go-admin/common/models"

	"go-admin/common/dto"
)
```

## Search 模块

首先定义 search 接口对应的请求数据接收属性，其次是根据需要将属性一一列出。

| 接口名称      | 说明               |
| ------------- | ------------------ |
| GetNeedSearch | 实现 gorm 的 scope |

样例代码：

```go
// SysPostPageReq 列表或者搜索使用结构体
type SysPostPageReq struct {
	dto.Pagination `search:"-"`
	PostId         int    `form:"postId" search:"type:exact;column:post_id;table:sys_post" comment:"id"`        // id
	PostName       string `form:"postName" search:"type:contains;column:post_name;table:sys_post" comment:"名称"` // 名称
	PostCode       string `form:"postCode" search:"type:contains;column:post_code;table:sys_post" comment:"编码"` // 编码
	Sort           int    `form:"sort" search:"type:exact;column:sort;table:sys_post" comment:"排序"`             // 排序
	Status         int    `form:"status" search:"type:exact;column:status;table:sys_post" comment:"状态"`         // 状态
	Remark         string `form:"remark" search:"type:exact;column:remark;table:sys_post" comment:"备注"`         // 备注
}

func (m *SysPostPageReq) GetNeedSearch() interface{} {
	return *m
}
```

### struct 说明

只针对 serach 中内容说明：

| tags 名称 | 说明           |
| --------- | -------------- |
| type      | 操作类型       |
| column    | 数据库表字段名 |
| table     | 数据库表名称   |

### type 说明

| type                   | 描述          | query 示例            |
| :--------------------- | :------------ | :-------------------- |
| exact/iexact           | 等于          | status=1              |
| contains/icontanins    | 包含          | name=n                |
| gt/gte                 | 大于/大于等于 | age=18                |
| lt/lte                 | 小于/小于等于 | age=18                |
| startswith/istartswith | 以…起始       | content=hell          |
| endswith/iendswith     | 以…结束       | content=world         |
| in                     | in 查询       | status[]=0&status[]=1 |
| isnull                 | isnull 查询   | startTime=1           |
| order                  | 排序          | sort=asc/sort=desc    |
| join                   | 链接          | -                     |

示例：

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

## Insert 模块

| 接口名称 | 说明             |
| -------- | ---------------- |
| Generate | 模型转换         |
| GetId    | 获取数据 id 属性 |

```go
// SysPostInsertReq 增使用的结构体
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

// GetId 获取数据对应的ID
func (s *SysPostInsertReq) GetId() interface{} {
	return s.PostId
}
```

## Update 模块

| 接口名称 | 说明             |
| -------- | ---------------- |
| Generate | 模型转换         |
| GetId    | 获取数据 id 属性 |

```go
// SysPostUpdateReq 改使用的结构体
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

## Get 模块

| 接口名称 | 说明             |
| -------- | ---------------- |
| GetId    | 获取数据 id 属性 |

```go
// SysPostGetReq 获取单个的结构体
type SysPostGetReq struct {
	Id int `uri:"id"`
}

func (s *SysPostGetReq) GetId() interface{} {
	return s.Id
}
```

## Delete 模块

| 接口名称 | 说明             |
| -------- | ---------------- |
| Generate | 模型转换         |
| GetId    | 获取数据 id 属性 |

```go
// SysPostDeleteReq 删除的结构体
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
