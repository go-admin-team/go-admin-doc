---
title: core
order: 90
toc: menu
group:
  title: 高级使用
  order: 10
---

## Runtime

### 1. 系统配置

系统数据库配置项获取

##### SetConfig

设置对应 key 的 config

```go
// key 为配置项名称是一个字符串
// value 为配置项值是一个接口
sdk.Runtime.SetConfig(key, value)
```

##### GetConfig

获取对应 key 的 config

```go
sdk.Runtime.GetConfig("sys_wechat_webhook")

// 可以根据数据类型使用断言
sdk.Runtime.GetConfig("sys_wechat_webhook").(string)
// 返回的是一个interface{}类型，需要根据实际情况进行断言

```

### 2. 内存队列

内存队列是一个先进先出的队列，可以用来存储一些需要异步处理的数据，目前系统的 log 使用的是内存队列，业务中如需使用队列建议使用专业的消息队列，如：rabbitmq、kafka 等

##### GetMemoryQueue

获取内存队列

```go

// prefix 为队列名称
// GetMemoryQueue(prefix string) storage.AdapterQueue

// 获取内存队列
var Queue = sdk.Runtime.GetMemoryQueue("")


```

##### SetQueueAdapter

设置队列适配器

```go

// 获取内存队列
var Queue = sdk.Runtime.GetMemoryQueue("")
// 设置队列适配器
sdk.Runtime.SetQueueAdapter(Queue)

```

##### GetQueueAdapter()

获取内存适配器

##### GetQueueAdapter().Register()

注册监听事件

```go
// 获取内存队列
var Queue = sdk.Runtime.GetMemoryQueue("")
// 设置队列适配器
sdk.Runtime.SetQueueAdapter(Queue)
// 注册监听事件
sdk.Runtime.GetQueueAdapter().Register(“log”, models.SaveLoginLog)

```

事件被触发后会执行注册的回调函数

以下提供一段伪代码为大家参考。

```go
// SaveLoginLog 从队列中获取登录日志
func SaveLoginLog(message storage.Messager) (err error) {
	//准备db
	db := sdk.Runtime.GetDbByKey(message.GetPrefix())

  ...

  // 解析数据
	rb, err = json.Marshal(message.GetValues())

  ...

  // 保存数据
	err = db.Create(&l).Error
	if err != nil {
		return err
	}
	return nil
}
```

### 3. 数据库

##### GetDb

获取所有 map 里的 db 数据

```go
sdk.Runtime.GetDb()

// return map[string]*gorm.DB

```

##### GetDbByKey

获取所有 map 里的 db 数据

```go

sdk.Runtime.GetDbByKey("*")

// return *gorm.DB

```

##### SetDb

设置对应 key 的 db

```go

sdk.Runtime.SetDb(key, db )

// 无返回值

```

### 4. 用户信息

##### GetUserId

获取用户 id，需要使用 gin 的上下文中

```go

// c 为gin.Context

user.GetUserId(c)

```

##### GetUserName

获取用户名称，需要使用 gin 的上下文中

```go

// c 为gin.Context
user.GetUserName(c)

```

以下提供一段伪代码为大家参考。

```go

// 本段代码来自go-admin-pro 项目 SysApi 模块的修改接口；

func (e SysApi) Update(c *gin.Context) {
	req := dto.SysApiUpdateReq{}
  // 初始化
  ...

  // 获取用户id
	req.SetUpdateBy(user.GetUserId(c))

  ...
  // 存储业务
	e.OK(req.GetId())
}
```

##### GetRoleId

获取角色 id，需要使用 gin 的上下文中

```go

// c 为gin.Context
user.GetRoleId(c)

```

##### GetRoleKey

获取角色 key，需要使用 gin 的上下文中

```go

// c 为gin.Context
user.GetRoleKey(c)

```

##### GetRoleName

获取角色名称，需要使用 gin 的上下文中

```go

// c 为gin.Context
user.GetRoleName(c)

```

##### GetDeptId

获取部门 id，需要使用 gin 的上下文中

```go

// c 为gin.Context
user.GetDeptId(c)

```

##### GetDeptName

获取部门名称，需要使用 gin 的上下文中

```go

// c 为gin.Context
user.GetDeptName(c)

```

以上伪代码均来源于 go-admin 项目，如有疑问可以在交流群中留言或者提交 issuesß。
