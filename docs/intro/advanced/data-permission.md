---
nav:
  title: 开发
  order: 2
  second:
    title: 进阶
    order: 1
group:
  title: 分层开发
  order: 5
title: 数据权限
order: 8
toc: content
description: go-admin 数据权限：五种数据范围的含义与实现、在 Actions 模式与手写模式下如何启用、依赖的表结构，以及"查不到数据"时的排查顺序。
keywords: [go-admin 数据权限, 数据范围 dataScope, golang 行级权限, 部门数据隔离]
---

# 数据权限

菜单与接口权限决定**能不能访问某个功能**，数据权限决定**在这个功能里能看到哪些数据**。同样打开用户列表，管理员看到全部，部门主管只看到本部门，普通员工只看到自己创建的——这就是数据权限。

go-admin 的数据权限按**角色**配置，过滤依据是数据表的 `create_by` 字段。

## 五种数据范围

在「角色管理」中为角色设置数据范围，取值与行为如下：

| 值 | 名称 | 过滤规则 |
| --- | --- | --- |
| 1 | 全部数据权限 | 不加任何过滤 |
| 2 | 自定数据权限 | 限定为 `sys_role_dept` 中为该角色配置的部门下的用户所创建的数据 |
| 3 | 本部门数据权限 | 限定为与当前用户同部门的用户所创建的数据 |
| 4 | 本部门及以下数据权限 | 在 3 的基础上，包含所有下级部门（按 `sys_dept.dept_path` 匹配）|
| 5 | 仅本人数据权限 | 限定为当前用户自己创建的数据 |

判断依据取自登录用户：关联 `sys_user` 与 `sys_role` 得到 `data_scope`、`dept_id` 与 `role_id`，据此拼接查询条件。

## 全局开关

数据权限受配置项 `application.enabledp` 控制：

```yml
settings:
  application:
    # 数据权限功能开关
    enabledp: true
```

**关闭时（默认值为 `false`）所有过滤都不生效**，无论角色配置了哪种数据范围，查询都会返回全部数据。这是排查"数据权限没起作用"时首先要确认的一项。

## 在自己的模块中启用

### Actions 模式

在路由中挂上 `actions.PermissionAction()` 即可，通用 Action 内部会自动应用过滤：

```go
r := v1.Group("/demo-product").
    Use(authMiddleware.MiddlewareFunc()).
    Use(middleware.AuthCheckRole())
{
    m := &models.DemoProduct{}
    r.GET("", actions.PermissionAction(), actions.IndexAction(m, new(dto.DemoProductSearch), func() interface{} {
        list := make([]models.DemoProduct, 0)
        return &list
    }))
    r.GET("/:id", actions.PermissionAction(), actions.ViewAction(new(dto.DemoProductById), func() interface{} {
        return &models.DemoProduct{}
    }))
}
```

`PermissionAction()` 负责在请求上下文中放入当前用户的数据权限信息，后续的 Action 从中取出并拼进查询条件。**漏挂这个中间件，过滤就不会生效**。

### 手写模式

自行编写 Handler 与 Service 时需要三步。

Api 层取出数据权限并传给 Service：

```go
//数据权限检查
p := actions.GetPermissionFromContext(c)

list := make([]models.SysApi, 0)
var count int64
err = s.GetPage(&req, p, &list, &count)
```

Service 方法接收该参数，并加入 `Scopes`:

```go
func (e *SysApi) GetPage(c *dto.SysApiGetPageReq, p *actions.DataPermission, list *[]models.SysApi, count *int64) error {
    var data models.SysApi

    err := e.Orm.Model(&data).
        Scopes(
            cDto.MakeCondition(c.GetNeedSearch()),
            cDto.Paginate(c.GetPageSize(), c.GetPageIndex()),
            actions.Permission(data.TableName(), p),
        ).
        Find(list).Limit(-1).Offset(-1).
        Count(count).Error
    return err
}
```

路由同样需要挂 `actions.PermissionAction()`。

## 表结构要求

数据权限依赖以下字段与表，缺一不可：

| 对象 | 用途 |
| --- | --- |
| 业务表的 `create_by` | 过滤依据，记录数据的创建者 |
| `sys_user.dept_id` | 用户所属部门 |
| `sys_role.data_scope` | 角色的数据范围设置 |
| `sys_dept.dept_path` | 部门层级路径，「本部门及以下」依赖它 |
| `sys_role_dept` | 「自定数据权限」中角色与部门的对应关系 |

业务表只要按[数据库表规范](/intro/advanced/db)包含公共字段，`create_by` 就会由框架在写入时自动填充，无需手动赋值。

:::warning
过滤基于 `create_by`，因此**通过数据库直接导入、或绕过框架写入的数据，其 `create_by` 可能为空**，这类数据在非「全部数据权限」下对任何人都不可见。

导入历史数据时需要一并写好 `create_by`。

:::

## 查不到数据时的排查顺序

数据权限生效后最常见的现象是"明明有数据却查不到"。按以下顺序排查：

1. **确认 `enabledp` 是否为 `true`** —— 关闭时所有人都能看到全部数据，若现象是"看到了不该看的"，问题在这里；
2. **确认当前账号角色的数据范围** —— 在角色管理中查看，范围 5 时只能看到自己创建的数据；
3. **确认数据的 `create_by`** —— 直接查库确认目标数据的 `create_by` 是否为空，或是否属于预期的用户；
4. **确认路由挂了 `actions.PermissionAction()`** —— 漏挂时过滤不生效，现象相反：能看到全部数据；
5. **确认部门层级** —— 使用「本部门及以下」时，检查 `sys_dept.dept_path` 是否正确，路径不对会导致下级部门匹配不到。

:::info
排查时可以在 Service 中临时使用 `e.Orm.Debug()` 打印实际执行的 SQL，直接查看拼出的过滤条件——比逐层猜测快得多。

:::

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
