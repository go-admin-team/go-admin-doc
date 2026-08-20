---
nav:
  title: 开发
  order: 2
  second:
    title: 进阶
    order: 1
group:
  title: 进阶能力
  order: 7
title: Runtime 核心 API
order: 1
toc: content
description: go-admin Runtime 提供的核心 API：系统配置读写、多租户下数据库与队列的获取方式、缓存与队列适配器的绑定方法。
keywords: [go-admin runtime, go-admin 系统配置 api, golang 运行时容器]
---

## Runtime

`sdk.Runtime` 是一个进程内的全局容器，持有数据库连接、缓存/队列适配器、Casbin enforcer、定时任务等运行时对象，供业务代码随取随用。多租户场景下，大部分方法都有 `xxxByTenant(tenant string)` 的变体，租户标识通常传 `c.Request.Host`。

### 1. 系统配置

用于在运行时读写任意键值，不需要提前声明结构体字段——适合存运营可调整的开关、临时配置，而不是每次改都要发版的场景。

##### SetConfigValue / GetConfigValue

```go
// 设置默认租户下的配置
sdk.Runtime.SetConfigValue("sys_wechat_webhook", "https://...")

// 读取，返回 interface{}，需要按实际类型断言
url, _ := sdk.Runtime.GetConfigValue("sys_wechat_webhook").(string)
```

多租户场景使用 `SetConfigValueByTenant(tenant, key, value)` / `GetConfigValueByTenant(tenant, key)`。

### 2. 队列

##### GetQueuePrefix（推荐）

获取当前配置选中的队列——配置文件里配了 `redis` 就是 Redis 实现，没配就是内存实现。**业务代码应该始终用这个方法**，见[队列](/intro/advanced/queue)。

```go
// prefix 通常传 c.Request.Host，多租户下用于区分消息归属；单租户传空字符串
queue := sdk.Runtime.GetQueuePrefix("")
queue.Register("log", models.SaveLoginLog)
go queue.Run()
```

:::warning
`Register` 之后必须调用 `Run()`，否则消息只会被 `Append` 进去，永远不会被消费。

:::

##### GetMemoryQueue（已弃用）

**始终返回进程内内存队列，无视配置文件里选的是什么。** 早期版本这是获取队列的唯一方式，现在请改用 `GetQueuePrefix`——继续使用 `GetMemoryQueue` 意味着即使配置文件里配了 Redis，这处代码依然只在本进程内工作，多实例部署时互相看不到对方的消息。

### 3. 数据库

##### GetDb

获取**默认租户**的数据库连接：

```go
sdk.Runtime.GetDb()
// 返回 *gorm.DB
```

##### GetDbByTenant

获取指定租户的数据库连接，多租户场景下按 `c.Request.Host` 区分：

```go
sdk.Runtime.GetDbByTenant(c.Request.Host)
// 返回 *gorm.DB
```

未启用[多租户](/configure/tenant)时，数据库统一注册在通配符键 `"*"` 下，此时无论传入什么租户标识都会返回同一个连接——这也是为什么单租户项目里到处传 `c.Request.Host` 也能正常工作。真正按域名区分数据库，只在启用多租户、且该域名确实注册过时才会发生；查无此租户又没有 `"*"` 兜底时返回 `nil`。

##### GetAllDb

获取全部租户的数据库连接，用于需要遍历所有库的场景（例如定时任务对每个租户各跑一遍）：

```go
sdk.Runtime.GetAllDb()
// 返回 map[string]*gorm.DB
```

##### SetDb / SetDbByTenant

```go
sdk.Runtime.SetDb(db)                    // 设置默认租户
sdk.Runtime.SetDbByTenant(tenant, db)    // 设置指定租户
```

:::warning
`GetDb()` 和 `GetAllDb()` 容易搞混——前者返回单个 `*gorm.DB`，后者返回 `map[string]*gorm.DB`。这两个方法在早期版本中是反过来命名的（当时的 `GetDb()` 就是现在的 `GetAllDb()`），照抄旧代码或旧文章容易在这里出编译错误。

:::

### 4. 用户信息

以下方法均需要 `gin.Context`，来自包 `github.com/go-admin-team/go-admin-core/sdk/pkg/jwtauth/user`：

```go
user.GetUserId(c)     // 用户 ID
user.GetUserName(c)   // 用户名
user.GetRoleId(c)     // 角色 ID
user.GetRoleKey(c)    // 角色标识
user.GetRoleName(c)   // 角色名称
user.GetDeptId(c)     // 部门 ID
user.GetDeptName(c)   // 部门名称
```

这些值来自 JWT payload，认证流程见[认证与鉴权](/intro/advanced/auth)。典型用法是在写入操作中记录操作人：

```go
func (e SysApi) Update(c *gin.Context) {
    req := dto.SysApiUpdateReq{}
    // ...绑定参数...

    req.SetUpdateBy(user.GetUserId(c))

    // ...执行更新...
    e.OK(req.GetId())
}
```

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
