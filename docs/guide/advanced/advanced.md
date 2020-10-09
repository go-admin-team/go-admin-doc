# 无代码 CRUD

当前项目内置了单表的 CRUD 函数，可以零代码实现单表的增删改查；只用简单配置路由即可；

无代码 CRUD，需要有 路由、dto、model 三部分组成；以下是三块的示例代码；

## 路由

完整示例：

```go
func registerSysJobRouter(v1 *gin.RouterGroup, authMiddleware *jwt.GinJWTMiddleware) {

 r := v1.Group("/sysjob").Use(authMiddleware.MiddlewareFunc()).Use(middleware.AuthCheckRole())
 {
  sysJob := &models.SysJob{}
  r.GET("", actions.PermissionAction(), actions.IndexAction(sysJob, new(dto.SysJobSearch), func() interface{} {
   list := make([]models.SysJob, 0)
   return &list
  }))
  r.GET("/:id", actions.PermissionAction(), actions.ViewAction(new(dto.SysJobById), func() interface{} {
   return &dto.SysJobItem{}
  }))
  r.POST("", actions.CreateAction(new(dto.SysJobControl)))
  r.PUT("", actions.PermissionAction(), actions.UpdateAction(new(dto.SysJobControl)))
  r.DELETE("", actions.PermissionAction(), actions.DeleteAction(new(dto.SysJobById)))
 }
}
```

## dto

dto 支持多种查询条件判断：

```go
/**
 * exact / iexact 等于
 * contains / icontains 包含
 * gt / gte 大于 / 大于等于
 * lt / lte 小于 / 小于等于
 * startswith / istartswith 以…起始
 * endswith / iendswith 以…结束
 * in
 * isnull
 * order 排序
 */
```

例如：

```go
search:"type:exact;column:job_id;table:sys_job"`
```

完整示例：

```go
package dto

import (
	"github.com/gin-gonic/gin"

	"go-admin/app/admin/models"
	"go-admin/common/dto"
	"go-admin/common/log"
	common "go-admin/common/models"
)

type SysJobSearch struct {
	dto.Pagination `search:"-"`
	JobId          int    `form:"jobId" search:"type:exact;column:job_id;table:sys_job"`
	JobName        string `form:"jobName" search:"type:icontains;column:job_name;table:sys_job"`
	JobGroup       string `form:"jobGroup" search:"type:exact;column:job_group;table:sys_job"`
	CronExpression string `form:"cronExpression" search:"type:exact;column:cron_expression;table:sys_job"`
	InvokeTarget   string `form:"invokeTarget" search:"type:exact;column:invoke_target;table:sys_job"`
	Status         int    `form:"status" search:"type:exact;column:status;table:sys_job"`
}

func (m *SysJobSearch) GetNeedSearch() interface{} {
	return *m
}

func (m *SysJobSearch) Bind(ctx *gin.Context) error {
	err := ctx.ShouldBind(m)
	if err != nil {
		log.Errorf("MsgID[%s] Bind error: %s", err)
	}
	return err
}

func (m *SysJobSearch) Generate() dto.Index {
	o := *m
	return &o
}

type SysJobControl struct {
	JobId          uint    `json:"jobId"`
	JobName        string `json:"jobName" validate:"required"` // 名称
	JobGroup       string `json:"jobGroup"`                    // 任务分组
	JobType        int    `json:"jobType"`                     // 任务类型
	CronExpression string `json:"cronExpression"`              // cron表达式
	InvokeTarget   string `json:"invokeTarget"`                // 调用目标
	Args           string `json:"args"`                        // 目标参数
	MisfirePolicy  int    `json:"misfirePolicy"`               // 执行策略
	Concurrent     int    `json:"concurrent"`                  // 是否并发
	Status         int    `json:"status"`                      // 状态
	EntryId        int    `json:"entryId"`                     // job启动时返回的id
}

func (s *SysJobControl) Bind(ctx *gin.Context) error {
	return ctx.ShouldBind(s)
}

func (s *SysJobControl) Generate() dto.Control {
	cp := *s
	return &cp
}

func (s *SysJobControl) GenerateM() (common.ActiveRecord, error) {
	return &models.SysJob{
		JobId:          s.JobId,
		JobName:        s.JobName,
		JobGroup:       s.JobGroup,
		JobType:        s.JobType,
		CronExpression: s.CronExpression,
		InvokeTarget:   s.InvokeTarget,
		Args:           s.Args,
		MisfirePolicy:  s.MisfirePolicy,
		Concurrent:     s.Concurrent,
		Status:         s.Status,
		EntryId:        s.EntryId,
	}, nil
}

func (s *SysJobControl) GetId() interface{} {
	return s.JobId
}

type SysJobById struct {
	dto.ObjectById
}

func (s *SysJobById) Generate() dto.Control {
	cp := *s
	return &cp
}

func (s *SysJobById) GenerateM() (common.ActiveRecord, error) {
	return &models.SysJob{}, nil
}
```

## model

完整示例：

```go
type SysJob struct {
	JobId          uint   `json:"jobId" gorm:"primary_key;AUTO_INCREMENT"` // 编码
	JobName        string `json:"jobName" gorm:"size:255;"`                // 名称
	JobGroup       string `json:"jobGroup" gorm:"size:255;"`               // 任务分组
	JobType        int    `json:"jobType" gorm:"size:1;"`                  // 任务类型
	CronExpression string `json:"cronExpression" gorm:"size:255;"`         // cron表达式
	InvokeTarget   string `json:"invokeTarget" gorm:"size:255;"`           // 调用目标
	Args           string `json:"args" gorm:"size:255;"`                   // 目标参数
	MisfirePolicy  int    `json:"misfirePolicy" gorm:"size:255;"`          // 执行策略
	Concurrent     int    `json:"concurrent" gorm:"size:1;"`               // 是否并发
	Status         int    `json:"status" gorm:"size:1;"`                   // 状态
	EntryId        int    `json:"entry_id" gorm:"size:11;"`                // job启动时返回的id
	CreateBy       string `json:"createBy" gorm:"size:128;"`               //
	UpdateBy       string `json:"updateBy" gorm:"size:128;"`               //
	BaseModel

	DataScope      string `json:"dataScope" gorm:"-"`
}
```
