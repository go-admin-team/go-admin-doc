---
nav:
  title: Development
  order: 2
  second:
    title: Advanced
    order: 1
group:
  title: Advanced Capabilities
  order: 7
title: Runtime Core API
order: 1
toc: content
description: The core API go-admin's Runtime exposes — reading and writing system config, getting the database and queue under multi-tenancy, and binding cache/queue adapters.
keywords: [go-admin runtime, go-admin system config api, golang runtime container]
---

## Runtime

`sdk.Runtime` is a process-wide global container holding database connections, cache/queue adapters, the Casbin enforcer, scheduled jobs, and other runtime objects for business code to reach for. Under multi-tenancy, most methods have an `xxxByTenant(tenant string)` variant, where the tenant identifier is usually `c.Request.Host`.

### 1. System Config

Used to read and write arbitrary key-value pairs at runtime without declaring struct fields up front — good for operator-adjustable switches or temporary config that shouldn't need a release every time it changes.

##### SetConfigValue / GetConfigValue

```go
// set config under the default tenant
sdk.Runtime.SetConfigValue("sys_wechat_webhook", "https://...")

// read it back; returns interface{}, assert to the real type
url, _ := sdk.Runtime.GetConfigValue("sys_wechat_webhook").(string)
```

Under multi-tenancy use `SetConfigValueByTenant(tenant, key, value)` / `GetConfigValueByTenant(tenant, key)`.

### 2. Queue

##### GetQueuePrefix (recommended)

Gets whichever queue the configuration currently selects — a `redis` section in the config file means the Redis implementation, no section means in-memory. **Business code should always use this method**; see [Queue](/en-US/intro/advanced/queue).

```go
// prefix is usually c.Request.Host, used under multi-tenancy to attribute messages; pass an empty string for single-tenant
queue := sdk.Runtime.GetQueuePrefix("")
queue.Register("log", models.SaveLoginLog)
go queue.Run()
```

:::warning
`Run()` must be called after `Register`, or messages only ever get `Append`ed and are never consumed.

:::

##### GetMemoryQueue (deprecated)

**Always returns the in-process memory queue, regardless of what the config file selects.** This used to be the only way to get a queue; use `GetQueuePrefix` instead now — sticking with `GetMemoryQueue` means that even with Redis configured, this code still only works within its own process, and instances in a multi-instance deployment never see each other's messages.

### 3. Database

##### GetDb

Gets the connection for the **default tenant**:

```go
sdk.Runtime.GetDb()
// returns *gorm.DB
```

##### GetDbByTenant

Gets the connection for a given tenant, distinguished under multi-tenancy by `c.Request.Host`:

```go
sdk.Runtime.GetDbByTenant(c.Request.Host)
// returns *gorm.DB
```

Without [multi-tenancy](/en-US/configure/tenant) enabled, the database is registered under the wildcard key `"*"`, and any tenant identifier passed in returns that same connection — which is why passing `c.Request.Host` everywhere still works fine in a single-tenant project. Databases actually get split by domain only once multi-tenancy is enabled and that domain has genuinely been registered; if a tenant isn't found and there's no `"*"` fallback, this returns `nil`.

##### GetAllDb

Gets every tenant's database connection, for cases that need to iterate over all of them (a scheduled job running once per tenant, for example):

```go
sdk.Runtime.GetAllDb()
// returns map[string]*gorm.DB
```

##### SetDb / SetDbByTenant

```go
sdk.Runtime.SetDb(db)                    // sets the default tenant
sdk.Runtime.SetDbByTenant(tenant, db)    // sets a given tenant
```

:::warning
`GetDb()` and `GetAllDb()` are easy to mix up — the former returns a single `*gorm.DB`, the latter a `map[string]*gorm.DB`. These two were named the other way round in an earlier version (what was then `GetDb()` is today's `GetAllDb()`), so copying old code or an old article tends to produce a compile error right here.

:::

### 4. User Info

The following all require a `gin.Context`, from the package `github.com/go-admin-team/go-admin-core/sdk/pkg/jwtauth/user`:

```go
user.GetUserId(c)     // user ID
user.GetUserName(c)   // username
user.GetRoleId(c)     // role ID
user.GetRoleKey(c)    // role key
user.GetRoleName(c)   // role name
user.GetDeptId(c)     // department ID
user.GetDeptName(c)   // department name
```

These values come from the JWT payload; see [Authentication & Authorization](/en-US/intro/advanced/auth) for the login flow. A typical use is recording who made a write:

```go
func (e SysApi) Update(c *gin.Context) {
    req := dto.SysApiUpdateReq{}
    // ...bind params...

    req.SetUpdateBy(user.GetUserId(c))

    // ...perform the update...
    e.OK(req.GetId())
}
```

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
