# api

`go-admin` 的 api 全部在 api 文件夹中，系统默认的每一个 api 至少有 5 个函数；分别对应了：分页列表、查询、新增、修改、删除；

## package 和 import

首先，需要是`package`名称和 `import` package 引用关系

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
```

## struct

创建当前 api 业务的结构体

```go
type SysFileDir struct {
	apis.Api
}
```

---

:::tip 接口具体业务
以下代码是就是具体对应的接口函数了，这如果是增删改查函数使用代码生成工具已经可以在 0 代码的情况下创建业务功能。
:::

## GetList

分页数据列表接口

```go
func (e *SysFileDir) GetSysFileDirList(c *gin.Context) {
	log := e.GetLogger(c) // <-----------------------------1、获取log
	search := new(dto.SysFileDirSearch) // <---------------2、实例化dto构体
	db, err := e.GetOrm(c)      // <-----------------------3、获取db
	if err != nil {
		log.Error(err)
		return
	}

	err = control.Bind(c)        // <----------------------4、解析请求数据
	if err != nil {
		log.Warnf("ShouldBind error: %#v",err.Error())
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
	}

	var list *[]models.SysFileDirL // <--------------------5、实例化输出参数模型
	serviceStudent := service.SysFileDir{}  // <-----------6、实例化业务对象
	serviceStudent.Log = log
	serviceStudent.Orm = db
	list, err = serviceStudent.SetSysFileDir(search) //<---7、函数调用
	if err != nil {
		log.Errorf("SetSysFileDir error, %s", err)
		e.Error(c, http.StatusUnprocessableEntity, err, "查询失败")
		return
	}

	e.OK(c, list, "查询成功") // <--------------------------8、结果输出
}
```

## Get

数据详情接口

```go
func (e *SysFileDir) GetSysFileDir(c *gin.Context) {
	log := e.GetLogger(c)// <------------------------------------1、获取log
    control := new(dto.SysFileDirById) // <----------------------2、实例化dto构体
	db, err := e.GetOrm(c)     // <------------------------------3、获取db
	if err != nil {
		log.Error(err)
		return
	}

	//查看详情
	err = control.Bind(c)         // <---------------------------4、解析请求数据
	if err != nil {
		log.Warnf("ShouldBind error: %#v",err.Error())
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
	}

	var object models.SysFileDir// <-----------------------------5、实例化输出参数模型

	serviceSysFileDir := service.SysFileDir{}// <----------------6、实例化业务对象
	serviceSysFileDir.Log = log
	serviceSysFileDir.Orm = db
	err = serviceSysFileDir.GetSysFileDir(control, &object)//<---7、函数调用
	if err != nil {
		log.Errorf("GetSysFileDir error, %s", err)
		e.Error(c, http.StatusInternalServerError, err, "查询失败")
		return
	}

	e.OK(c, object, "查看成功")// <-------------------------------8、结果输出
}
```

## Post

数据创建接口

```go
func (e *SysFileDir) InsertSysFileDir(c *gin.Context) {
    log := e.GetLogger(c)// <---------------------------------------1、获取log
	control := new(dto.SysFileDirControl)// <-----------------------2、实例化dto构体
	db, err := e.GetOrm(c)     // <---------------------------------3、获取db
	if err != nil {
		log.Error(err)
		return
	}

	//新增操作
	err = control.Bind(c)     // <----------------------------------4、解析请求数据
	if err != nil {
		log.Warnf("ShouldBind error: %#v",err.Error())
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
	}
	// 设置创建人
	control.CreateBy = user.GetUserId(c)

	serviceSysFileDir := service.SysFileDir{}// <-------------------5、实例化业务对象
	serviceSysFileDir.Orm = db
	serviceSysFileDir.Log = log
	err = serviceSysFileDir.InsertSysFileDir(control)//<------------6、函数调用
	if err != nil {
		log.Errorf("InsertSysFileDir error, %s", err)
		e.Error(c, http.StatusInternalServerError, err, "创建失败")
		return
	}

	e.OK(c, control.ID, "创建成功")// <-------------------------------7、结果输出
}
```

## Put

数据修改接口

```go
func (e *SysFileDir) UpdateSysFileDir(c *gin.Context) {
    log := e.GetLogger(c)// <---------------------------------------1、获取log
	control := new(dto.SysFileDirControl)// <-----------------------2、实例化dto构体
	db, err := e.GetOrm(c)     // <---------------------------------3、获取db
	if err != nil {
		log.Error(err)
		return
	}

	err = control.Bind(c)     // <----------------------------------4、解析请求数据
	if err != nil {
		log.Warnf("ShouldBind error: %#v",err.Error())
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
	}
	// 设置创建人
	control.UpdateBy = user.GetUserId(c)

	//数据权限检查
	p := actions.GetPermissionFromContext(c)

	serviceSysFileDir := service.SysFileDir{}// <-------------------5、实例化业务对象
	serviceSysFileDir.Orm = db
	serviceSysFileDir.Log = log
	err = serviceSysFileDir.UpdateSysFileDir(control, p)//<---------6、函数调用
	if err != nil {
		log.Errorf("UpdateSysFileDir error, %s", err)
		e.Error(c, http.StatusInternalServerError, err, "更新失败")
		return
	}
	e.OK(c, control.ID, "更新成功")// <------------------------------7、结果输出
}
```

## Detele

数据删除接口

```go
func (e *SysFileDir) DeleteSysFileDir(c *gin.Context) {
	log := e.GetLogger(c)// <---------------------------------------1、获取log
    control := new(dto.SysFileDirById) // <-------------------------2、实例化dto构体
	db, err := e.GetOrm(c)     // <---------------------------------3、获取db
	if err != nil {
		log.Error(err)
		return
	}

	//删除操作
	err = control.Bind(c)     // <----------------------------------4、解析请求数据
	if err != nil {
		log.Warnf("ShouldBind error: %#v",err.Error())
		e.Error(c, http.StatusUnprocessableEntity, err, "参数验证失败")
	}

	// 设置编辑人
	control.UpdateBy = user.GetUserId(c)

	// 数据权限检查
	p := actions.GetPermissionFromContext(c)

	serviceSysFileDir := service.SysFileDir{}// <-------------------5、实例化业务对象
	serviceSysFileDir.Orm = db
	err = serviceSysFileDir.RemoveSysFileDir(control, p)//<---------6、函数调用
	if err != nil {
		log.Errorf("RemoveSysFileDir error, %s", err)
		e.Error(c, http.StatusInternalServerError, err, "删除失败")
		return
	}
	e.OK(c, control.Id, "删除成功")// <------------------------------7、结果输出
}
```
