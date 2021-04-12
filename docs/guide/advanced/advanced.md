# actions 模式

:::tip 说明
`go-admin`服务是存在两种处理模式的;

简单的 crud 可以直接使用 `actions模式`；

复杂的业务可以使用 `常规模式`；
:::

当前项目内置了单表的 CRUD 函数，可以零代码实现单表的增删改查；只用简单配置路由即可；

无代码 CRUD，需要有 路由、dto、model 三部分组成；以下是三块的示例代码；

## router

完整示例：

```go
package router

import (
	"github.com/gin-gonic/gin"
	"go-admin/common/middleware"

	jwt "github.com/go-admin-team/go-admin-core/sdk/pkg/jwtauth"
	"go-admin/app/admin/models"
	"go-admin/app/admin/service/dto"
	"go-admin/common/actions"
)

func init() {
	routerCheckRole = append(routerCheckRole, registerSysCategoryRouter)
}

// 需认证的路由代码
func registerSysCategoryRouter(v1 *gin.RouterGroup, authMiddleware *jwt.GinJWTMiddleware) {
	r := v1.Group("/syscategory").Use(authMiddleware.MiddlewareFunc()).Use(middleware.AuthCheckRole())
	{
		model := &models.SysCategory{}
		r.GET("", actions.PermissionAction(), actions.IndexAction(model, new(dto.SysCategorySearch), func() interface{} {
			list := make([]models.SysCategory, 0)
			return &list
		}))
		r.GET("/:id", actions.PermissionAction(), actions.ViewAction(new(dto.SysCategoryById), nil))
		r.POST("", actions.CreateAction(new(dto.SysCategoryControl)))
		r.PUT("/:id", actions.PermissionAction(), actions.UpdateAction(new(dto.SysCategoryControl)))
		r.DELETE("", actions.PermissionAction(), actions.DeleteAction(new(dto.SysCategoryById)))
	}
}
```

## dto

dto 支持多种查询条件判断：

| 名称   | 说明         | 示例         |
| ------ | ------------ | ------------ |
| type   | 条件类型     | exact        |
| column | 数据库对应列 | name         |
| table  | 数据库对应表 | sys_category |

:::tip type 支持的类型

- exact / iexact 等于
- contains / icontains 包含
- gt / gte 大于 / 大于等于
- lt / lte 小于 / 小于等于
- startswith / istartswith 以…起始
- endswith / iendswith 以…结束
- in
- isnull
- order 排序
  :::

```go
search:"type:exact;column:job_id;table:sys_job"`
```

完整示例：

```go
package dto

import (
	"errors"
	vd "github.com/bytedance/go-tagexpr/v2/validator"
	"github.com/gin-gonic/gin"
	"github.com/go-admin-team/go-admin-core/sdk/api"

	"go-admin/app/admin/models"
	"go-admin/common/dto"
	common "go-admin/common/models"
)

type SysCategorySearch struct {
	dto.Pagination `search:"-"`
	Name           string `form:"name" search:"type:exact;column:name;table:sys_category" comment:"名称" vd:"?"`
	Status         string `form:"status" search:"type:exact;column:status;table:sys_category" comment:"状态" vd:"?"`
	CateId         int    `form:"cateId" search:"type:exact;column:cate_id;table:sys_category" comment:"分类id" vd:"?"`
}

func (m *SysCategorySearch) GetNeedSearch() interface{} {
	return *m
}

func (m *SysCategorySearch) Bind(ctx *gin.Context) error {
	log := api.GetRequestLogger(ctx)

	err := ctx.ShouldBind(m)
	if err != nil {
		log.Debugf("ShouldBind error: %s", err.Error())
	}

	if err = vd.Validate(m); err != nil {
		log.Errorf("Validate error: %s", err.Error())
		return err
	}
	return err
}

func (m *SysCategorySearch) Generate() dto.Index {
	o := *m
	return &o
}

type SysCategoryControl struct {
	ID     int    `uri:"Id" comment:"标识"`
	Name   string `json:"name" comment:"名称" vd:"len($)>0 && $!=' '; msg:'invalid name: 不能是空字符串'"`
	Img    string `json:"img" comment:"图标" vd:"?"`
	Sort   int    `json:"sort" comment:"排序" vd:"?"`
	Status int    `json:"status" comment:"状态" vd:"$>0; msg:'invalid status: 状态无效'"`
	Remark string `json:"remark" comment:"备注" vd:"?"`
}

func (s *SysCategoryControl) Bind(ctx *gin.Context) error {
	log := api.GetRequestLogger(ctx)
	err := ctx.ShouldBindUri(s)
	if err != nil {
		log.Errorf("ShouldBindUri error: %s", err.Error())
		return errors.New("数据绑定出错")
	}
	err = ctx.ShouldBind(s)
	if err != nil {
		log.Errorf("ShouldBind error: %s", err.Error())
		err = errors.New("数据绑定出错")
	}
	if err1 := vd.Validate(s); err != nil {
		log.Errorf("Validate error: %s", err1.Error())
		return err1
	}
	return err
}

func (s *SysCategoryControl) Generate() dto.Control {
	cp := *s
	return &cp
}

func (s *SysCategoryControl) GenerateM() (common.ActiveRecord, error) {
	return &models.SysCategory{
		Model:  common.Model{Id: s.ID},
		Name:   s.Name,
		Img:    s.Img,
		Sort:   s.Sort,
		Status: s.Status,
		Remark: s.Remark,
	}, nil
}

func (s *SysCategoryControl) GetId() interface{} {
	return s.ID
}

type SysCategoryById struct {
	dto.ObjectById `vd:"?"`
}

func (s *SysCategoryById) Generate() dto.Control {
	cp := *s
	return &cp
}

func (s *SysCategoryById) GenerateM() (common.ActiveRecord, error) {
	return &models.SysCategory{}, nil
}
```

## model

完整示例：

```go
package models

import (
	"go-admin/common/models"
)

type SysCategory struct {
	models.Model
	Name   string `json:"name" gorm:"type:varchar(255);comment:名称"`
	Img    string `json:"img" gorm:"type:varchar(255);comment:图标"`
	Sort   int    `json:"sort" gorm:"type:int(4);comment:排序"`
	Status int    `json:"status" gorm:"type:int(1);comment:状态"`
	Remark string `json:"remark" gorm:"type:varchar(255);comment:备注"`
	models.ControlBy
	models.ModelTime
}

func (SysCategory) TableName() string {
	return "sys_category"
}

func (e *SysCategory) Generate() models.ActiveRecord {
	o := *e
	return &o
}

func (e *SysCategory) GetId() interface{} {
	return e.Id
}
```
