# 通用方法

首先说明一下结构：
这里只是针对`app`文件夹说明；
```shell
.
├── admin
│   ├── apis
│   │   ├── monitor
│   │   │   └── server.go
│   │   ├── public
│   │   │   └── file.go
│   │   ├── sys_file
│   │   │   ├── sys_file_dir.go
│   │   │   └── sys_file_info.go
│   │   ├── syscontent
│   │   │   └── syscontent.go
│   │   ├── sysjob
│   │   │   └── sysjob.go
│   │   ├── system
│   │   │   ├── captcha.go
│   │   │   ├── dept.go
│   │   │   ├── dict
│   │   │   │   ├── dictdata.go
│   │   │   │   └── dicttype.go
│   │   │   ├── index.go
│   │   │   ├── info.go
│   │   │   ├── menu.go
│   │   │   ├── post.go
│   │   │   ├── role.go
│   │   │   ├── rolemenu.go
│   │   │   ├── settings.go
│   │   │   ├── sys_config
│   │   │   │   └── sys_config.go
│   │   │   ├── sys_login_log
│   │   │   │   └── sys_login_log.go
│   │   │   ├── sys_opera_log
│   │   │   │   └── sys_opera_log.go
│   │   │   └── sysuser.go
│   │   └── tools
│   │       ├── dbcolumns.go
│   │       ├── dbtables.go
│   │       ├── gen.go
│   │       └── systables.go
│   ├── middleware
│   │   ├── auth.go
│   │   ├── customerror.go
│   │   ├── db.go
│   │   ├── db_other.go
│   │   ├── db_sqlite3.go
│   │   ├── handler
│   │   │   ├── auth.go
│   │   │   ├── httpshandler.go
│   │   │   └── ping.go
│   │   ├── header.go
│   │   ├── init.go
│   │   ├── logger.go
│   │   └── permission.go
│   ├── models
│   │   ├── casbinrule.go
│   │   ├── datascope.go
│   │   ├── dept.go
│   │   ├── dictdata.go
│   │   ├── dicttype.go
│   │   ├── gorm
│   │   │   └── data.go
│   │   ├── initdb.go
│   │   ├── login.go
│   │   ├── menu.go
│   │   ├── model.go
│   │   ├── post.go
│   │   ├── role.go
│   │   ├── roledept.go
│   │   ├── rolemenu.go
│   │   ├── sys_file_dir.go
│   │   ├── sys_file_info.go
│   │   ├── syscategory.go
│   │   ├── syscontent.go
│   │   ├── sysjob.go
│   │   ├── system
│   │   │   ├── sys_config.go
│   │   │   ├── sys_login_log.go
│   │   │   └── sys_opera_log.go
│   │   ├── system.go
│   │   ├── sysuser.go
│   │   └── tools
│   │       ├── dbcolumns.go
│   │       ├── dbtables.go
│   │       ├── syscolumns.go
│   │       └── systables.go
│   ├── router
│   │   ├── initrouter.go
│   │   ├── monitor.go
│   │   ├── router.go
│   │   ├── sys_category.go
│   │   ├── sys_config.go
│   │   ├── sys_file_dir.go
│   │   ├── sys_file_info.go
│   │   ├── sys_login_log.go
│   │   ├── sys_opera_log.go
│   │   ├── syscontent.go
│   │   ├── sysjob.go
│   │   └── sysrouter.go
│   └── service
│       ├── dto
│       │   ├── sys_category.go
│       │   ├── sys_config.go
│       │   ├── sys_file_dir.go
│       │   ├── sys_login_log.go
│       │   ├── sys_opera_log.go
│       │   ├── sys_setting.go
│       │   ├── sysfileinfo.go
│       │   ├── sysjob.go
│       │   └── systables.go
│       ├── sys_config.go
│       ├── sys_file_dir.go
│       ├── sys_login_log.go
│       ├── sys_opera_log.go
│       ├── sys_setting.go
│       ├── sysfileinfo.go
│       └── sysjob.go
└── jobs
    ├── examples.go
    ├── jobbase.go
    └── type.go
```

admin：可以理解成一个project

apis：是project的api文件

middleware：是project的中间件

models：是project的数据库层的模型

router：是project的路由

service：是project的业务逻辑处理

service.dto：是project的api对应的数据接收以及解析模型

搞清楚了这些我们开始往下进行；

直接使用项目中的源代码进行说明：我们操作日志为例；

按照 models、service.dto、service、apis、router这个顺序来说明；
## models

```go
package system

import (
	"go-admin/common/models"

	"time"
)

type SysOperaLog struct {
	models.Model
	Title         string    `json:"title" gorm:"type:varchar(255);comment:操作模块"`                  //
	BusinessType  string    `json:"businessType" gorm:"type:varchar(128);comment:操作类型"`           //
	BusinessTypes string    `json:"businessTypes" gorm:"type:varchar(128);comment:BusinessTypes"` //
	Method        string    `json:"method" gorm:"type:varchar(128);comment:函数"`                   //
	RequestMethod string    `json:"requestMethod" gorm:"type:varchar(128);comment:请求方式"`          //
	OperatorType  string    `json:"operatorType" gorm:"type:varchar(128);comment:操作类型"`           //
	OperName      string    `json:"operName" gorm:"type:varchar(128);comment:操作者"`                //
	DeptName      string    `json:"deptName" gorm:"type:varchar(128);comment:部门名称"`               //
	OperUrl       string    `json:"operUrl" gorm:"type:varchar(255);comment:访问地址"`                //
	OperIp        string    `json:"operIp" gorm:"type:varchar(128);comment:客户端ip"`                //
	OperLocation  string    `json:"operLocation" gorm:"type:varchar(128);comment:访问位置"`           //
	OperParam     string    `json:"operParam" gorm:"type:varchar(255);comment:请求参数"`              //
	Status        string    `json:"status" gorm:"type:varchar(4);comment:操作状态"`                   //
	OperTime      time.Time `json:"operTime" gorm:"type:timestamp;comment:操作时间"`                  //
	JsonResult    string    `json:"jsonResult" gorm:"type:varchar(255);comment:返回数据"`             //
	Remark        string    `json:"remark" gorm:"type:varchar(255);comment:备注"`                   //
	LatencyTime   string    `json:"latencyTime" gorm:"type:varchar(128);comment:耗时"`              //
	UserAgent     string    `json:"userAgent" gorm:"type:varchar(255);comment:ua"`                //
	models.ControlBy
	models.ModelTime
}

func (SysOperaLog) TableName() string {
	return "sys_opera_log"
}

func (e *SysOperaLog) Generate() models.ActiveRecord {
	o := *e
	return &o
}

func (e *SysOperaLog) GetId() interface{} {
	return e.ID
}

```

首先，是一个结构体`SysOperaLog` 里边含有正常的数据库表字段，但是其中又包含了三个结构体：

1、`models.Model` 表id 默认主键是固定的ID和自增长的int类型

2、`models.ControlBy`  表创建人和修改人 数据库表默认必有字段

3、`models.ModelTime` 表创建时间和修改时间、删除时间的字段默认必有字段

针对以上几个字段做一个简短说明：

创建人是默认数据权限控制必用字段，所以系统要求必须的有或者存在该字段；

创建时间和修改时间、删除时间等信息中，删除时间是必须要有的，因为目前系统使用的gorm的软删除；

如果针对以上条件条件无法满足，可能需要考虑自定义；

## dto

```go
package dto

import (
	"github.com/gin-gonic/gin"

	"go-admin/app/admin/models/system"
	"go-admin/common/dto"
	"go-admin/common/log"
	common "go-admin/common/models"
	"go-admin/tools"

	"time"
)

// SysOperaLogSearch 搜索列表对应的数据接收模型 主要针对分页、列表；
type SysOperaLogSearch struct {
	dto.Pagination `search:"-"`
	Title         string `form:"title" search:"type:contains;column:title;table:sys_opera_log" comment:"操作模块"`
	Method        string `form:"method" search:"type:contains;column:method;table:sys_opera_log" comment:"函数"`
	RequestMethod string `form:"requestMethod" search:"type:contains;column:request_method;table:sys_opera_log" comment:"请求方式"`
	OperUrl       string `form:"operUrl" search:"type:contains;column:oper_url;table:sys_opera_log" comment:"访问地址"`
	OperIp        string `form:"operIp" search:"type:exact;column:oper_ip;table:sys_opera_log" comment:"客户端ip"`
}

// GetNeedSearch 将search 转化为interface
func (m *SysOperaLogSearch) GetNeedSearch() interface{} {
	return *m
}

// Bind 从上下文中解析数据
func (m *SysOperaLogSearch) Bind(ctx *gin.Context) error {
	msgID := tools.GenerateMsgIDFromContext(ctx)
	err := ctx.ShouldBind(m)
	if err != nil {
		log.Debugf("MsgID[%s] ShouldBind error: %s", msgID, err.Error())
	}
	return err
}

// SysOperaLogControl 创建、修改使用的数据接收模型
type SysOperaLogControl struct {
	ID            int       `uri:"ID" comment:"编码"` // 编码
	Title         string    `json:"title" comment:"操作模块"`
	BusinessType  string    `json:"businessType" comment:"操作类型"`
	BusinessTypes string    `json:"businessTypes" comment:""`
	Method        string    `json:"method" comment:"函数"`
	RequestMethod string    `json:"requestMethod" comment:"请求方式"`
	OperatorType  string    `json:"operatorType" comment:"操作类型"`
	OperName      string    `json:"operName" comment:"操作者"`
	DeptName      string    `json:"deptName" comment:"部门名称"`
	OperUrl       string    `json:"operUrl" comment:"访问地址"`
	OperIp        string    `json:"operIp" comment:"客户端ip"`
	OperLocation  string    `json:"operLocation" comment:"访问位置"`
	OperParam     string    `json:"operParam" comment:"请求参数"`
	Status        string    `json:"status" comment:"操作状态"`
	OperTime      time.Time `json:"operTime" comment:"操作时间"`
	JsonResult    string    `json:"jsonResult" comment:"返回数据"`
	Remark        string    `json:"remark" comment:"备注"`
	LatencyTime   string    `json:"latencyTime" comment:"耗时"`
	UserAgent     string    `json:"userAgent" comment:"ua"`
}

// Bind 从上下文中解析数据
func (s *SysOperaLogControl) Bind(ctx *gin.Context) error {
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

// Generate 将数据转化成数据库使用的结构体
func (s *SysOperaLogControl) Generate() (*system.SysOperaLog, error) {
	return &system.SysOperaLog{
		Model:         common.Model{ID: s.ID},
		Title:         s.Title,
		BusinessType:  s.BusinessType,
		BusinessTypes: s.BusinessTypes,
		Method:        s.Method,
		RequestMethod: s.RequestMethod,
		OperatorType:  s.OperatorType,
		OperName:      s.OperName,
		DeptName:      s.DeptName,
		OperUrl:       s.OperUrl,
		OperIp:        s.OperIp,
		OperLocation:  s.OperLocation,
		OperParam:     s.OperParam,
		Status:        s.Status,
		OperTime:      s.OperTime,
		JsonResult:    s.JsonResult,
		Remark:        s.Remark,
		LatencyTime:   s.LatencyTime,
		UserAgent:     s.UserAgent,
	}, nil
}

// GetId 获取id
func (s *SysOperaLogControl) GetId() interface{} {
	return s.ID
}

// SysOperaLogById 通过id查询、删除等使用的模型
type SysOperaLogById struct {
	Id  int   `uri:"id"`
	Ids []int `json:"ids"`
}

// GetId 获取ID 这里将url中的id和body中的id数组合并统一返回
func (s *SysOperaLogById) GetId() interface{} {
	if len(s.Ids) > 0 {
		s.Ids = append(s.Ids, s.Id)
		return s.Ids
	}
	return s.Id
}

// Bind 绑定上下文中的数据
func (s *SysOperaLogById) Bind(ctx *gin.Context) error {
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

// 设置更新人id
func (s *SysOperaLogById) SetUpdateBy(id int) {
	
}

```

代码里边针对各个函数已经添加说明备注；有什么问题也可以提交issues

## service

```go
package service

import (
	"errors"
	"go-admin/app/admin/models/system"
	"go-admin/app/admin/service/dto"
	cDto "go-admin/common/dto"
	"go-admin/common/log"
	"go-admin/common/service"
	"gorm.io/gorm"
)

type SysOperaLog struct {
	service.Service
}

// GetSysOperaLogPage 获取SysOperaLog列表
func (e *SysOperaLog) GetSysOperaLogPage(c *dto.SysOperaLogSearch, list *[]system.SysOperaLog, count *int64) error {
	var err error
	var data system.SysOperaLog
	msgID := e.MsgID

	err = e.Orm.Model(&data).
		Scopes(
			cDto.MakeCondition(c.GetNeedSearch()),
			cDto.Paginate(c.GetPageSize(), c.GetPageIndex()),
		).
		Find(list).Limit(-1).Offset(-1).
		Count(count).Error
	if err != nil {
		log.Errorf("msgID[%s] db error:%s", msgID, err)
		return err
	}
	return nil
}

// GetSysOperaLog 获取SysOperaLog对象
func (e *SysOperaLog) GetSysOperaLog(d *dto.SysOperaLogById, model *system.SysOperaLog) error {
	var err error
	var data system.SysOperaLog
	msgID := e.MsgID

	db := e.Orm.Model(&data).
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

// InsertSysOperaLog 创建SysOperaLog对象
func (e *SysOperaLog) InsertSysOperaLog(model *system.SysOperaLog) error {
	var err error
	var data system.SysOperaLog
	msgID := e.MsgID

	err = e.Orm.Model(&data).
		Create(model).Error
	if err != nil {
		log.Errorf("msgID[%s] db error:%s", msgID, err)
		return err
	}
	return nil
}

// UpdateSysOperaLog 修改SysOperaLog对象
func (e *SysOperaLog) UpdateSysOperaLog(c *system.SysOperaLog) error {
	var err error
	var data system.SysOperaLog
	msgID := e.MsgID

	db := e.Orm.Model(&data).
		Where(c.GetId()).Updates(c)
	if db.Error != nil {
		log.Errorf("msgID[%s] db error:%s", msgID, err)
		return err
	}
	if db.RowsAffected == 0 {
		return errors.New("无权更新该数据")

	}
	return nil
}

// RemoveSysOperaLog 删除SysOperaLog
func (e *SysOperaLog) RemoveSysOperaLog(d *dto.SysOperaLogById) error {
	var err error
	var data system.SysOperaLog
	msgID := e.MsgID

	db := e.Orm.Model(&data).Delete(&data, d.GetId())
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

service中包含了对数据的一个数据操作

## apis

```go
package sys_opera_log

import (
	"github.com/gin-gonic/gin"

	"go-admin/app/admin/models/system"
	"go-admin/app/admin/service"
	"go-admin/app/admin/service/dto"
	"go-admin/common/apis"
	"go-admin/common/log"
	"go-admin/tools"

	"net/http"
)

// SysOperaLog apis中的操作日志api对象
type SysOperaLog struct {
	apis.Api
}

// GetSysOperaLogList 分页查看数据列表
func (e *SysOperaLog) GetSysOperaLogList(c *gin.Context) {
	msgID := tools.GenerateMsgIDFromContext(c)
	d := new(dto.SysOperaLogSearch)
	db, err := tools.GetOrm(c)
	if err != nil {
		log.Error(err)
		return
	}

	//查询列表
	err = d.Bind(c)
	if err != nil {
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
		return
	}

	list := make([]system.SysOperaLog, 0)
	var count int64
	serviceStudent := service.SysOperaLog{}
	serviceStudent.MsgID = msgID
	serviceStudent.Orm = db
	err = serviceStudent.GetSysOperaLogPage(d, &list, &count)
	if err != nil {
		e.Error(c, http.StatusUnprocessableEntity, err, "查询失败")
		return
	}

	e.PageOK(c, list, int(count), d.GetPageIndex(), d.GetPageSize(), "查询成功")
}

// GetSysOperaLog 通过id获取对象数据
func (e *SysOperaLog) GetSysOperaLog(c *gin.Context) {
	control := new(dto.SysOperaLogById)
	db, err := tools.GetOrm(c)
	if err != nil {
		log.Error(err)
		return
	}

	msgID := tools.GenerateMsgIDFromContext(c)
	//查看详情
	err = control.Bind(c)
	if err != nil {
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
		return
	}
	var object system.SysOperaLog

	serviceSysOperlog := service.SysOperaLog{}
	serviceSysOperlog.MsgID = msgID
	serviceSysOperlog.Orm = db
	err = serviceSysOperlog.GetSysOperaLog(control, &object)
	if err != nil {
		e.Error(c, http.StatusUnprocessableEntity, err, "查询失败")
		return
	}

	e.OK(c, object, "查看成功")
}

// InsertSysOperaLog 数据新建
func (e *SysOperaLog) InsertSysOperaLog(c *gin.Context) {
	control := new(dto.SysOperaLogControl)
	db, err := tools.GetOrm(c)
	if err != nil {
		log.Error(err)
		return
	}

	msgID := tools.GenerateMsgIDFromContext(c)
	//新增操作
	err = control.Bind(c)
	if err != nil {
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
		return
	}
	object, err := control.Generate()
	if err != nil {
		e.Error(c, http.StatusInternalServerError, err, "模型生成失败")
		return
	}
	// 设置创建人
	object.SetCreateBy(tools.GetUserId(c))

	serviceSysOperaLog := service.SysOperaLog{}
	serviceSysOperaLog.Orm = db
	serviceSysOperaLog.MsgID = msgID
	err = serviceSysOperaLog.InsertSysOperaLog(object)
	if err != nil {
		log.Error(err)
		e.Error(c, http.StatusInternalServerError, err, "创建失败")
		return
	}

	e.OK(c, object.GetId(), "创建成功")
}

// UpdateSysOperaLog 数据更新
func (e *SysOperaLog) UpdateSysOperaLog(c *gin.Context) {
	control := new(dto.SysOperaLogControl)
	db, err := tools.GetOrm(c)
	if err != nil {
		log.Error(err)
		return
	}

	msgID := tools.GenerateMsgIDFromContext(c)
	//更新操作
	err = control.Bind(c)
	if err != nil {
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
		return
	}
	object, err := control.Generate()
	if err != nil {
		e.Error(c, http.StatusInternalServerError, err, "模型生成失败")
		return
	}
	object.SetUpdateBy(tools.GetUserId(c))

	serviceSysOperaLog := service.SysOperaLog{}
	serviceSysOperaLog.Orm = db
	serviceSysOperaLog.MsgID = msgID
	err = serviceSysOperaLog.UpdateSysOperaLog(object)
	if err != nil {
		log.Error(err)
		return
	}
	e.OK(c, object.GetId(), "更新成功")
}

func (e *SysOperaLog) DeleteSysOperaLog(c *gin.Context) {
	control := new(dto.SysOperaLogById)
	db, err := tools.GetOrm(c)
	if err != nil {
		log.Error(err)
		return
	}

	msgID := tools.GenerateMsgIDFromContext(c)
	//删除操作
	err = control.Bind(c)
	if err != nil {
		log.Errorf("MsgID[%s] Bind error: %s", msgID, err)
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
		return
	}

	serviceSysOperaLog := service.SysOperaLog{}
	serviceSysOperaLog.Orm = db
	serviceSysOperaLog.MsgID = msgID
	err = serviceSysOperaLog.RemoveSysOperaLog(control)
	if err != nil {
		log.Error(err)
		return
	}
	e.OK(c, control.GetId(), "删除成功")
}

```

## routers

```go
package router

import (
	"github.com/gin-gonic/gin"
	"go-admin/app/admin/apis/system/sys_opera_log"
	"go-admin/app/admin/middleware"
	jwt "go-admin/pkg/jwtauth"
)

func init() {
	routerCheckRole = append(routerCheckRole, registerSysOperaLogRouter)
}

// 需认证的路由代码
func registerSysOperaLogRouter(v1 *gin.RouterGroup, authMiddleware *jwt.GinJWTMiddleware) {
	api := &sys_opera_log.SysOperaLog{}
	r := v1.Group("/sys-opera-log").Use(authMiddleware.MiddlewareFunc()).Use(middleware.AuthCheckRole())
	{
		r.GET("", api.GetSysOperaLogList)
		r.GET("/:id", api.GetSysOperaLog)
		r.POST("", api.InsertSysOperaLog)
		r.PUT("/:id", api.UpdateSysOperaLog)
		r.DELETE("", api.DeleteSysOperaLog)
	}
}

```

创建一个空的go文件，设置init初始化接口方法，根据业务定义好路由注册函数名称，并且正确配置正确的权限控制中间件，一套业务就结束了；

有什么问题给作者在github中提交issues吧！

谢谢阅读！
