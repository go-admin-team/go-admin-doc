# 通用方法

下边创建一个最简单的表做一下简单的业务；

## sql

```sql
CREATE TABLE `tb_test_stu` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '名称',
  `create_by` int(64) unsigned DEFAULT NULL,
  `update_by` int(64) unsigned DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='测试学生表';
```

## 路由

```go
package router

import (
	"github.com/gin-gonic/gin"
	"go-admin/app/admin/apis/tbteststu"
	"go-admin/app/admin/middleware"
	jwt "go-admin/pkg/jwtauth"
)

func init() {
	routerCheckRole = append(routerCheckRole, registerTbTestStuRouter)
}

// 需认证的路由代码
func registerTbTestStuRouter(v1 *gin.RouterGroup, authMiddleware *jwt.GinJWTMiddleware) {
	api := &tbteststu.TbTestStu{}
	r := v1.Group("/tbteststu").Use(authMiddleware.MiddlewareFunc()).Use(middleware.AuthCheckRole())
	{
		r.GET("", api.GetTbTestStuList)
		r.GET("/:id", api.GetTbTestStu)
		r.POST("", api.InsertTbTestStu)
		r.PUT("/:id", api.UpdateTbTestStu)
		r.DELETE("", api.DeleteTbTestStu)
	}
}
```

## api

```go
package tbteststu

import (
	"github.com/gin-gonic/gin"
	"go-admin/app/admin/service"
	common "go-admin/common/models"
	"net/http"

	"go-admin/app/admin/models"
	"go-admin/app/admin/service/dto"
	"go-admin/common/actions"
	"go-admin/common/apis"
	"go-admin/common/log"
	"go-admin/tools"
)

type TbTestStu struct {
	apis.Api
}

func (e *TbTestStu) GetTbTestStuList(c *gin.Context) {
	msgID := tools.GenerateMsgIDFromContext(c)
	d := new(dto.TbTestStuSearch)
	db, err := tools.GetOrm(c)
	if err != nil {
		log.Error(err)
		return
	}

	req := d.Generate()

	//查询列表
	err = req.Bind(c)
	if err != nil {
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
		return
	}

	//数据权限检查
	p := actions.GetPermissionFromContext(c)

	list := make([]models.TbTestStu, 0)
	var count int64
	serviceStudent := service.TbTestStu{}
	serviceStudent.MsgID = msgID
	serviceStudent.Orm = db
	err = serviceStudent.GetTbTestStuPage(req, p, &list, &count)
	if err != nil {
		e.Error(c, http.StatusUnprocessableEntity, err, "查询失败")
		return
	}

	e.PageOK(c, list, int(count), req.GetPageIndex(), req.GetPageSize(), "查询成功")
}

func (e *TbTestStu) GetTbTestStu(c *gin.Context) {
	control := new(dto.TbTestStuById)
	db, err := tools.GetOrm(c)
	if err != nil {
		log.Error(err)
		return
	}

	msgID := tools.GenerateMsgIDFromContext(c)
	//查看详情
	req := control.Generate()
	err = req.Bind(c)
	if err != nil {
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
		return
	}
	var object models.TbTestStu

	//数据权限检查
	p := actions.GetPermissionFromContext(c)

	serviceTbTestStu := service.TbTestStu{}
	serviceTbTestStu.MsgID = msgID
	serviceTbTestStu.Orm = db
	err = serviceTbTestStu.GetTbTestStu(req, p, &object)
	if err != nil {
		e.Error(c, http.StatusUnprocessableEntity, err, "查询失败")
		return
	}

	e.OK(c, object, "查看成功")
}

func (e *TbTestStu) InsertTbTestStu(c *gin.Context) {
	control := new(dto.TbTestStuControl)
	db, err := tools.GetOrm(c)
	if err != nil {
		log.Error(err)
		return
	}

	msgID := tools.GenerateMsgIDFromContext(c)
	//新增操作
	req := control.Generate()
	err = req.Bind(c)
	if err != nil {
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
		return
	}
	var object common.ActiveRecord
	object, err = req.GenerateM()
	if err != nil {
		e.Error(c, http.StatusInternalServerError, err, "模型生成失败")
		return
	}
	// 设置创建人
	object.SetCreateBy(tools.GetUserIdUint(c))

	serviceTbTestStu := service.TbTestStu{}
	serviceTbTestStu.Orm = db
	serviceTbTestStu.MsgID = msgID
	err = serviceTbTestStu.InsertTbTestStu(object)
	if err != nil {
		log.Error(err)
		e.Error(c, http.StatusInternalServerError, err, "创建失败")
		return
	}

	e.OK(c, object.GetId(), "创建成功")
}

func (e *TbTestStu) UpdateTbTestStu(c *gin.Context) {
	control := new(dto.TbTestStuControl)
	db, err := tools.GetOrm(c)
	if err != nil {
		log.Error(err)
		return
	}

	msgID := tools.GenerateMsgIDFromContext(c)
	req := control.Generate()
	//更新操作
	err = req.Bind(c)
	if err != nil {
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
		return
	}
	var object common.ActiveRecord
	object, err = req.GenerateM()
	if err != nil {
		e.Error(c, http.StatusInternalServerError, err, "模型生成失败")
		return
	}
	object.SetUpdateBy(tools.GetUserIdUint(c))

	//数据权限检查
	p := actions.GetPermissionFromContext(c)

	serviceTbTestStu := service.TbTestStu{}
	serviceTbTestStu.Orm = db
	serviceTbTestStu.MsgID = msgID
	err = serviceTbTestStu.UpdateTbTestStu(object, p)
	if err != nil {
		log.Error(err)
		return
	}
	e.OK(c, object.GetId(), "更新成功")
}

func (e *TbTestStu) DeleteTbTestStu(c *gin.Context) {
	control := new(dto.TbTestStuById)
	db, err := tools.GetOrm(c)
	if err != nil {
		log.Error(err)
		return
	}

	msgID := tools.GenerateMsgIDFromContext(c)
	//删除操作
	req := control.Generate()
	err = req.Bind(c)
	if err != nil {
		log.Errorf("MsgID[%s] Bind error: %s", msgID, err)
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
		return
	}
	var object common.ActiveRecord
	object, err = req.GenerateM()
	if err != nil {
		e.Error(c, http.StatusInternalServerError, err, "模型生成失败")
		return
	}

	// 设置编辑人
	object.SetUpdateBy(tools.GetUserIdUint(c))

	// 数据权限检查
	p := actions.GetPermissionFromContext(c)

	serviceTbTestStu := service.TbTestStu{}
	serviceTbTestStu.Orm = db
	serviceTbTestStu.MsgID = msgID
	err = serviceTbTestStu.RemoveTbTestStu(req, object, p)
	if err != nil {
		log.Error(err)
		return
	}
	e.OK(c, object.GetId(), "删除成功")
}
```

## 模型

```go
package models

import (
    "gorm.io/gorm"

	"go-admin/common/models"
)

type TbTestStu struct {
    gorm.Model
    models.ControlBy

    Name string `json:"name" gorm:"type:varchar(255);comment:名称"` //
}

func (TbTestStu) TableName() string {
    return "tb_test_stu"
}

func (e *TbTestStu) Generate() models.ActiveRecord {
	o := *e
	return &o
}

func (e *TbTestStu) GetId() interface{} {
	return e.ID
}
```

## dto

```go
package dto

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"go-admin/app/admin/models"
	"go-admin/common/dto"
	"go-admin/common/log"
	common "go-admin/common/models"
	"go-admin/tools"
)

type TbTestStuSearch struct {
	dto.Pagination     `search:"-"`
    Name string `form:"name" search:"type:exact;column:name;table:tb_test_stu" comment:"名称"`


}

func (m *TbTestStuSearch) GetNeedSearch() interface{} {
	return *m
}

func (m *TbTestStuSearch) Bind(ctx *gin.Context) error {
    msgID := tools.GenerateMsgIDFromContext(ctx)
    err := ctx.ShouldBind(m)
    if err != nil {
    	log.Debugf("MsgID[%s] ShouldBind error: %s", msgID, err.Error())
    }
    return err
}

func (m *TbTestStuSearch) Generate() dto.Index {
	o := *m
	return &o
}

type TbTestStuControl struct {

    ID uint `uri:"ID" comment:""` //

    Name string `json:"name" comment:"名称"`

}

func (s *TbTestStuControl) Bind(ctx *gin.Context) error {
    msgID := tools.GenerateMsgIDFromContext(ctx)
    err := ctx.ShouldBindUri(s)
    if err != nil {
        log.Debugf("MsgID[%s] ShouldBindUri error: %s", msgID, err.Error())
        return err
    }
    err = ctx.ShouldBind(s)
    if err != nil {
        log.Debugf("MsgID[%s] ShouldBind error: %#v", msgID, err.Error())
    }
    return err
}

func (s *TbTestStuControl) Generate() dto.Control {
	cp := *s
	return &cp
}

func (s *TbTestStuControl) GenerateM() (common.ActiveRecord, error) {
	return &models.TbTestStu{

        Model:     gorm.Model{ID: s.ID},
        Name:  s.Name,
	}, nil
}

func (s *TbTestStuControl) GetId() interface{} {
	return s.ID
}

type TbTestStuById struct {
	dto.ObjectById
}

func (s *TbTestStuById) Generate() dto.Control {
	cp := *s
	return &cp
}

func (s *TbTestStuById) GenerateM() (common.ActiveRecord, error) {
	return &models.TbTestStu{}, nil
}
```

## service

```go
package service

import (
	"errors"
	"go-admin/app/admin/models"
	"go-admin/common/actions"
	cDto "go-admin/common/dto"
	"go-admin/common/log"
	common "go-admin/common/models"
	"go-admin/common/service"
	"gorm.io/gorm"
)

type TbTestStu struct {
	service.Service
}

// GetTbTestStuPage 获取TbTestStu列表
func (e *TbTestStu) GetTbTestStuPage(c cDto.Index, p *actions.DataPermission, list *[]models.TbTestStu, count *int64) error {
	var err error
	var data models.TbTestStu
	msgID := e.MsgID

	err = e.Orm.Model(&data).
		Scopes(
			cDto.MakeCondition(c.GetNeedSearch()),
			cDto.Paginate(c.GetPageSize(), c.GetPageIndex()),
			actions.Permission(data.TableName(), p),
		).
		Find(list).Limit(-1).Offset(-1).
		Count(count).Error
	if err != nil {
		log.Errorf("msgID[%s] db error:%s", msgID, err)
		return err
	}
	return nil
}

// GetTbTestStu 获取TbTestStu对象
func (e *TbTestStu) GetTbTestStu(d cDto.Control, p *actions.DataPermission, model *models.TbTestStu) error {
	var err error
	var data models.TbTestStu
	msgID := e.MsgID

	db := e.Orm.Model(&data).
		Scopes(
			actions.Permission(data.TableName(), p),
		).
		First(model, d.GetId())
	err = db.Error
	if err != nil && errors.Is(err, gorm.ErrRecordNotFound) {
		err = errors.New("查看对象不存在或无权查看")
		log.Errorf("msgID[%s] db error:%s", msgID, err)
		return err
	}
	if db.Error != nil {
		log.Errorf("msgID[%s] db error:%s", msgID, err)
		return err
	}
	return nil
}

// InsertTbTestStu 创建TbTestStu对象
func (e *TbTestStu) InsertTbTestStu(model common.ActiveRecord) error {
	var err error
	var data models.TbTestStu
	msgID := e.MsgID

	err = e.Orm.Model(&data).
		Create(model).Error
	if err != nil {
		log.Errorf("msgID[%s] db error:%s", msgID, err)
		return err
	}
	return nil
}

// UpdateTbTestStu 修改TbTestStu对象
func (e *TbTestStu) UpdateTbTestStu(c common.ActiveRecord, p *actions.DataPermission) error {
	var err error
	var data models.TbTestStu
	msgID := e.MsgID

	db := e.Orm.Model(&data).
		Scopes(
			actions.Permission(data.TableName(), p),
		).Where(c.GetId()).Updates(c)
	if db.Error != nil {
		log.Errorf("msgID[%s] db error:%s", msgID, err)
		return err
	}
	if db.RowsAffected == 0 {
		return errors.New("无权更新该数据")

	}
	return nil
}

// RemoveTbTestStu 删除TbTestStu
func (e *TbTestStu) RemoveTbTestStu(d cDto.Control, c common.ActiveRecord, p *actions.DataPermission) error {
	var err error
	var data models.TbTestStu
	msgID := e.MsgID

	db := e.Orm.Model(&data).
		Scopes(
			actions.Permission(data.TableName(), p),
		).Where(d.GetId()).Delete(c)
	if db.Error != nil {
		err = db.Error
		log.Errorf("MsgID[%s] Delete error: %s", msgID, err)
		return err
	}
	if db.RowsAffected == 0 {
		err = errors.New("无权删除该数据")
		return err
	}
	return nil
}
```
