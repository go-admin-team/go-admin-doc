# 常规模式

:::tip 说明
`go-admin`服务是存在两种处理模式的;

简单的 crud 可以直接使用 `actions模式`；

复杂的业务可以使用 `常规模式`；
:::

首先说明一下结构：
这里只是针对`app`文件夹说明；

```bash
.
└── admin
    ├── apis
    ├── models
    ├── router
    └── service
```

admin：可以理解成一个 project

apis：是 project 的 api 文件

models：是 project 的数据库层的模型

router：是 project 的路由

service：是 project 的业务逻辑处理

service.dto：是 project 的 api 对应的数据接收以及解析模型

搞清楚了这些我们开始往下进行；

直接使用项目中的源代码进行说明：我们操作日志为例；

按照 models、service.dto、service、apis、router 这个顺序来说明；

## models

```go
package models

import (
	"go-admin/common/models"
)

type SysFileDir struct {
	models.Model
	Label    string       `json:"label" gorm:"type:varchar(255);comment:目录名称"` // 目录名称
	PId      int          `json:"pId" gorm:"type:int(11);comment:上级目录"`        // 上级目录
	Sort     string       `json:"sort" gorm:"type:bigint(20);comment:排序"`      // 排序
	Path     string       `json:"path" gorm:"type:varchar(255);comment:路径"`    // 路径
	Children []SysFileDir `json:"children,omitempty" gorm:"-"`                 // 下级信息
	models.ControlBy
	models.ModelTime
}

type SysFileDirL struct {
	models.Model
	Label string `json:"label" gorm:"type:varchar(255);comment:目录名称"` // 目录名称
	PId   int    `json:"pId" gorm:"type:int(11);comment:上级目录"`        // 上级目录
	Sort  string `json:"sort" gorm:"type:bigint(20);comment:排序"`      // 排序
	Path  string `json:"path" gorm:"type:varchar(255);comment:路径"`    // 路径
	models.ControlBy
	models.ModelTime
	Children []SysFileDirL `json:"children,omitempty" gorm:"-"` // 下级信息
}

func (SysFileDir) TableName() string { /**/
	return "sys_file_dir"
}

func (e *SysFileDir) Generate() models.ActiveRecord {
	o := *e
	return &o
}

func (e *SysFileDir) GetId() interface{} {
	return e.Id
}
```

首先，是一个结构体`SysOperaLog` 里边含有正常的数据库表字段，但是其中又包含了三个结构体：

1、`models.Model` 表 id 默认主键是固定的 ID 和自增长的 int 类型

2、`models.ControlBy` 表创建人和修改人 数据库表默认必有字段

3、`models.ModelTime` 表创建时间和修改时间、删除时间的字段默认必有字段

针对以上几个字段做一个简短说明：

创建人是默认数据权限控制必用字段，所以系统要求必须的有或者存在该字段；

创建时间和修改时间、删除时间等信息中，删除时间是必须要有的，因为目前系统使用的 gorm 的软删除；

如果针对以上条件条件无法满足，可能需要考虑自定义；

## dto

to 支持多种查询条件判断：

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

```go
package dto

import (
	"github.com/gin-gonic/gin"
	"github.com/go-admin-team/go-admin-core/sdk/api"

	"go-admin/app/admin/models"
	"go-admin/common/dto"
	common "go-admin/common/models"
)

type SysFileDirSearch struct {
	dto.Pagination `search:"-"`

	ID    int    `form:"Id" search:"type:exact;column:id;table:sys_file_dir" comment:"标识"`
	Label string `form:"label" search:"type:exact;column:label;table:sys_file_dir" comment:"目录名称"`
	PId   string `form:"pId" search:"type:exact;column:p_id;table:sys_file_dir" comment:"上级目录"`
	//Sort  string `form:"sort" search:"type:exact;column:sort;table:sys_file_dir" comment:"排序"`
	Path string `form:"path" search:"type:exact;column:path;table:sys_file_dir" comment:"路径"`
}

func (m *SysFileDirSearch) GetNeedSearch() interface{} {
	return *m
}

func (m *SysFileDirSearch) Bind(ctx *gin.Context) error {
	log := api.GetRequestLogger(ctx)
	err := ctx.ShouldBind(m)
	if err != nil {
		log.Debugf("ShouldBind error: %s", err.Error())
	}
	return err
}

func (m *SysFileDirSearch) Generate() dto.Index {
	o := *m
	return &o
}

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

代码里边针对各个函数已经添加说明备注；有什么问题也可以提交 issues

## service

```go
package service

import (
	"errors"
	"fmt"

	"gorm.io/gorm"

	"go-admin/app/admin/models"
	"go-admin/app/admin/service/dto"
	"go-admin/common/actions"
	cDto "go-admin/common/dto"
	"go-admin/common/service"
)

type SysFileDir struct {
	service.Service
}

// GetSysFileDirPage 获取SysFileDir列表
func (e *SysFileDir) GetSysFileDirPage(c *dto.SysFileDirSearch, list *[]models.SysFileDirL) error {
	var err error
	var data models.SysFileDir

	err = e.Orm.Model(&data).
		Scopes(
			cDto.MakeCondition(c.GetNeedSearch()),
		).
		Find(list). //Limit(-1).Offset(-1).
		Error
	if err != nil {
		e.Log.Errorf("db error: %s", err)
		return err
	}
	return nil
}

// GetSysFileDir 获取SysFileDir对象
func (e *SysFileDir) GetSysFileDir(d cDto.Control, model *models.SysFileDir) error {
	var err error
	var data models.SysFileDir

	db := e.Orm.Model(&data).
		First(model, d.GetId())
	err = db.Error
	if err != nil && errors.Is(err, gorm.ErrRecordNotFound) {
		err = errors.New("查看对象不存在或无权查看")
		e.Log.Errorf("db error: %s", err)
		return err
	}
	if db.Error != nil {
		e.Log.Errorf("db error:%s", err)
		return err
	}
	return nil
}

// InsertSysFileDir 创建SysFileDir对象
func (e *SysFileDir) InsertSysFileDir(model *dto.SysFileDirControl) error {
	var err error
	data, _ := model.GenerateM()

	err = e.Orm.Create(data).Error
	if err != nil {
		e.Log.Errorf("db error: %s", err)
		return err
	}
	path := fmt.Sprintf("/%d", model.ID)
	//db = e.Orm.Model(&data).
	//	First(&data, model.GetId())
	//err = db.Error

	if model.PId != 0 {
		var dept models.SysFileDir
		e.Orm.Model(&models.SysFileDir{}).Where("id = ?", model.PId).First(&dept)
		path = dept.Path + path
	} else {
		path = "/0" + path
	}
	//var mp = map[string]string{}
	//mp["path"] = path
	if err = e.Orm.Model(&models.SysFileDir{}).Where("id = ?", model.ID).Update("path", path).Error; err != nil {
		return err
	}

	return nil
}

// UpdateSysFileDir 修改SysFileDir对象
func (e *SysFileDir) UpdateSysFileDir(c *dto.SysFileDirControl, p *actions.DataPermission) error {
	var err error
	data, _ := c.GenerateM()

	db := e.Orm.
		Scopes(
			actions.Permission(data.TableName(), p),
		).Where(c.ID).Updates(data)
	if db.Error != nil {
		e.Log.Errorf("db error: %s", err)
		return err
	}
	if db.RowsAffected == 0 {
		return errors.New("无权更新该数据")
	}
	return nil
}

// RemoveSysFileDir 删除SysFileDir
func (e *SysFileDir) RemoveSysFileDir(d *dto.SysFileDirById, p *actions.DataPermission) error {
	var err error
	var data models.SysFileDir

	db := e.Orm.Model(&data).
		Scopes(
			actions.Permission(data.TableName(), p),
		).Where(d.Id).Delete(&data)
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

func (e *SysFileDir) SetSysFileDir(c *dto.SysFileDirSearch) (*[]models.SysFileDirL, error) {
	var list []models.SysFileDirL
	err := e.GetSysFileDirPage(c, &list)
	m := make([]models.SysFileDirL, 0)
	for i := 0; i < len(list); i++ {
		if list[i].PId != 0 {
			continue
		}
		info := SysFileDirCall(&list, list[i])
		m = append(m, info)
	}
	return &m, err
}

func SysFileDirCall(list *[]models.SysFileDirL, m models.SysFileDirL) models.SysFileDirL {
	listGroup := *list
	min := make([]models.SysFileDirL, 0)
	for j := 0; j < len(listGroup); j++ {
		if m.Id != listGroup[j].PId {
			continue
		}
		mi := models.SysFileDirL{}
		mi.Id = listGroup[j].Id
		mi.PId = listGroup[j].PId
		mi.Label = listGroup[j].Label
		//mi.Sort = listGroup[j].Sort
		mi.CreatedAt = listGroup[j].CreatedAt
		mi.UpdatedAt = listGroup[j].UpdatedAt
		mi.Children = []models.SysFileDirL{}
		ms := SysFileDirCall(list, mi)
		min = append(min, ms)
	}
	if len(min) > 0 {
		m.Children = min
	} else {
		m.Children = nil
	}

	return m
}
```

service 中包含了对数据的一个数据操作

## apis

```go
package sys_file

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-admin-team/go-admin-core/sdk/pkg/jwtauth/user"

	"go-admin/app/admin/models"
	"go-admin/app/admin/service"
	"go-admin/app/admin/service/dto"
	"go-admin/common/actions"
	"go-admin/common/apis"
)

type SysFileDir struct {
	apis.Api
}

func (e *SysFileDir) GetSysFileDirList(c *gin.Context) {
	log := e.GetLogger(c)
	search := new(dto.SysFileDirSearch)
	db, err := e.GetOrm(c)
	if err != nil {
		log.Error(err)
		return
	}

	err = c.ShouldBind(search)
	if err != nil {
		log.Debugf("ShouldBind error: %s", err.Error())
	}

	var list *[]models.SysFileDirL
	serviceStudent := service.SysFileDir{}
	serviceStudent.Log = log
	serviceStudent.Orm = db
	list, err = serviceStudent.SetSysFileDir(search)
	if err != nil {
		log.Errorf("SetSysFileDir error, %s", err)
		e.Error(c, http.StatusUnprocessableEntity, err, "查询失败")
		return
	}

	e.OK(c, list, "查询成功")
}

func (e *SysFileDir) GetSysFileDir(c *gin.Context) {
	control := new(dto.SysFileDirById)
	log := e.GetLogger(c)
	db, err := e.GetOrm(c)
	if err != nil {
		log.Error(err)
		return
	}

	//查看详情
	err = c.ShouldBindUri(control)
	if err != nil {
		log.Warnf("ShouldBindUri error: %s", err.Error())
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
	}

	var object models.SysFileDir

	serviceSysFileDir := service.SysFileDir{}
	serviceSysFileDir.Log = log
	serviceSysFileDir.Orm = db
	err = serviceSysFileDir.GetSysFileDir(control, &object)
	if err != nil {
		log.Errorf("GetSysFileDir error, %s", err)
		e.Error(c, http.StatusInternalServerError, err, "查询失败")
		return
	}

	e.OK(c, object, "查看成功")
}

func (e *SysFileDir) InsertSysFileDir(c *gin.Context) {
	control := new(dto.SysFileDirControl)
	log := e.GetLogger(c)
	db, err := e.GetOrm(c)
	if err != nil {
		log.Error(err)
		return
	}

	//新增操作
	err = c.ShouldBindUri(control)
	if err != nil {
		log.Warnf("ShouldBindUri error: %s", err.Error())
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
		return
	}
	err = c.ShouldBind(control)
	if err != nil {
		log.Warnf("ShouldBind error: %s", err.Error())
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
		return
	}
	// 设置创建人
	control.CreateBy = user.GetUserId(c)

	serviceSysFileDir := service.SysFileDir{}
	serviceSysFileDir.Orm = db
	serviceSysFileDir.Log = log
	err = serviceSysFileDir.InsertSysFileDir(control)
	if err != nil {
		log.Errorf("InsertSysFileDir error, %s", err)
		e.Error(c, http.StatusInternalServerError, err, "创建失败")
		return
	}

	e.OK(c, control.ID, "创建成功")
}

func (e *SysFileDir) UpdateSysFileDir(c *gin.Context) {
	control := new(dto.SysFileDirControl)
	log := e.GetLogger(c)
	db, err := e.GetOrm(c)
	if err != nil {
		log.Error(err)
		return
	}

	err = c.ShouldBindUri(control)
	if err != nil {
		log.Warnf("ShouldBindUri error: %s", err.Error())
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
	}
	err = c.ShouldBind(control)
	if err != nil {
		log.Warnf("ShouldBind error: %#v", err.Error())
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
	}
	// 设置创建人
	control.UpdateBy = user.GetUserId(c)

	//数据权限检查
	p := actions.GetPermissionFromContext(c)

	serviceSysFileDir := service.SysFileDir{}
	serviceSysFileDir.Orm = db
	serviceSysFileDir.Log = log
	err = serviceSysFileDir.UpdateSysFileDir(control, p)
	if err != nil {
		log.Errorf("UpdateSysFileDir error, %s", err)
		e.Error(c, http.StatusInternalServerError, err, "更新失败")
		return
	}
	e.OK(c, control.ID, "更新成功")
}

func (e *SysFileDir) DeleteSysFileDir(c *gin.Context) {
	control := new(dto.SysFileDirById)
	log := e.GetLogger(c)
	db, err := e.GetOrm(c)
	if err != nil {
		log.Error(err)
		return
	}

	//删除操作
	err = c.ShouldBindUri(control)
	if err != nil {
		log.Warnf("ShouldBindUri error: %s",err.Error())
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
	}
	err = c.ShouldBind(control)
	if err != nil {
		log.Warnf("ShouldBind error: %#v",err.Error())
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
	}

	// 设置编辑人
	control.UpdateBy = user.GetUserId(c)

	// 数据权限检查
	p := actions.GetPermissionFromContext(c)

	serviceSysFileDir := service.SysFileDir{}
	serviceSysFileDir.Orm = db
	err = serviceSysFileDir.RemoveSysFileDir(control, p)
	if err != nil {
		log.Errorf("RemoveSysFileDir error, %s", err)
		e.Error(c, http.StatusInternalServerError, err, "删除失败")
		return
	}
	e.OK(c, control.Id, "删除成功")
}
```

## router

```go
package router

import (
	"github.com/gin-gonic/gin"
	jwt "github.com/go-admin-team/go-admin-core/sdk/pkg/jwtauth"
	"go-admin/app/admin/apis/sys_file"
	"go-admin/common/middleware"
)

func init() {
	routerCheckRole = append(routerCheckRole, registerSysFileDirRouter)
}

// 需认证的路由代码
func registerSysFileDirRouter(v1 *gin.RouterGroup, authMiddleware *jwt.GinJWTMiddleware) {
	api := &sys_file.SysFileDir{}
	r := v1.Group("/sysfiledir").Use(authMiddleware.MiddlewareFunc()).Use(middleware.AuthCheckRole())
	{
		r.GET("", api.GetSysFileDirList)
		r.GET("/:id", api.GetSysFileDir)
		r.POST("", api.InsertSysFileDir)
		r.PUT("/:id", api.UpdateSysFileDir)
		r.DELETE("/:id", api.DeleteSysFileDir)
	}
}
```

创建一个空的 go 文件，设置 init 初始化接口方法，根据业务定义好路由注册函数名称，并且正确配置正确的权限控制中间件，一套业务就结束了；

有什么问题给作者在 github 中提交 issues 吧！

谢谢阅读！
