# dto

首先介绍以下 dto 在 go-admin 中的作用。dto 是一个数据接收模块，每一个请求进来，携带的数据需要在 dto 中进行处理验证；

## Import

```go
package dto

import (
	"github.com/gin-gonic/gin"
	"github.com/go-admin-team/go-admin-core/sdk/api"

	"go-admin/app/admin/models"
	"go-admin/common/dto"
	common "go-admin/common/models"
)
```

## Search 模块

首先定义 search 接口对应的请求数据接收属性，其次是根据需要将属性一一列出。

| 接口名称      | 说明               |
| ------------- | ------------------ |
| GetNeedSearch | 实现 gorm 的 scope |
| Bind          | 数据 Bind          |
| Generate      | 模型转换           |

样例代码：

```go
type SysFileDirSearch struct {
	dto.Pagination `search:"-"`
	ID    int    `form:"Id" search:"type:exact;column:id;table:sys_file_dir" comment:"标识"`
	Label string `form:"label" search:"type:exact;column:label;table:sys_file_dir" comment:"目录名称"`
	PId   string `form:"pId" search:"type:exact;column:p_id;table:sys_file_dir" comment:"上级目录"`
	Path string `form:"path" search:"type:exact;column:path;table:sys_file_dir" comment:"路径"`
}

func (m *SysFileDirSearch) GetNeedSearch() interface{} {
	return *m
}

// Bind 数据Bind
func (m *SysFileDirSearch) Bind(ctx *gin.Context) error {
	log := api.GetRequestLogger(ctx)
	err := ctx.ShouldBind(m)
	if err != nil {
		log.Debugf("ShouldBind error: %s", err.Error())
	}
	return err
}

// Generate 模型转换
func (m *SysFileDirSearch) Generate() dto.Index {
	o := *m
	return &o
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

## Form 模块

| 接口名称  | 说明             |
| --------- | ---------------- |
| Bind      | 数据 Bind        |
| Generate  | 模型转换         |
| GenerateM | 数据模型转化     |
| GetId     | 获取数据 id 属性 |

```go
type SysFileDirControl struct {
	ID       int    `uri:"Id" comment:"标识"` // 标识
	Label    string `json:"label" comment:"目录名称"`
	PId      int    `json:"pId" comment:"上级目录"`
	Sort     string `json:"sort" comment:"排序"`
	Path     string `json:"path" comment:"路径"`
	CreateBy int    `json:"-"`
	UpdateBy int    `json:"-"`
}

func (s *SysFileDirControl) Bind(ctx *gin.Context) error {
	log := api.GetRequestLogger(ctx)
	err := ctx.ShouldBindUri(s)
	if err != nil {
		log.Debugf("ShouldBindUri error: %s", err.Error())
		return err
	}
	err = ctx.ShouldBind(s)
	if err != nil {
		log.Debugf("ShouldBind error: %s", err.Error())
	}
	return err
}

func (s *SysFileDirControl) Generate() dto.Control {
	cp := *s
	return &cp
}

func (s *SysFileDirControl) GenerateM() (common.ActiveRecord, error) {
	return &models.SysFileDir{
		Model: common.Model{Id: s.ID},
		Label: s.Label,
		PId:   s.PId,
		//Sort:  s.Sort,
		Path: s.Path,
		ControlBy: common.ControlBy{
			CreateBy: s.CreateBy,
			UpdateBy: s.UpdateBy,
		},
	}, nil
}

func (s *SysFileDirControl) GetId() interface{} {
	return s.ID
}
```

## Delete & detail 模块

| 接口名称  | 说明                                     |
| --------- | ---------------------------------------- |
| Bind      | 数据 Bind，不需要实现，go-admin 已经内置 |
| Generate  | 模型转换                                 |
| GenerateM | 数据模型转化                             |

```go
type SysFileDirById struct {
	dto.ObjectById
	UpdateBy int `json:"-"`
}

func (s *SysFileDirById) Generate() dto.Control {
	cp := *s
	return &cp
}

func (s *SysFileDirById) GenerateM() (common.ActiveRecord, error) {
	return &models.SysFileDir{}, nil
}
```
