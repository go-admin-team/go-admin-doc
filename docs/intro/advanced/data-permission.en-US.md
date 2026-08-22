---
nav:
  title: Development
  order: 2
  second:
    title: Advanced
    order: 1
group:
  title: Layered Development
  order: 5
title: Data Permissions
order: 8
toc: content
description: go-admin data permissions — what the five data scopes mean and how they're implemented, how to enable them under the Actions Pattern and the Hand-Written Pattern, the tables they depend on, and the checklist for "I can't see data that should be there".
keywords: [go-admin data permissions, data scope dataScope, golang row-level permissions, department data isolation]
---

# Data Permissions

Menu and API permissions decide **whether you can reach a feature at all**; data permissions decide **which rows you see once you're in it**. Open the same user list as an admin and you see everyone; as a department head you see your department; as a regular employee you see only what you created yourself — that's data permissions.

go-admin scopes data permissions by **role**, filtering on the `create_by` column of the data table.

## The Five Data Scopes

Set in Role Management, per role. Values and behaviour:

| Value | Name | Filter rule |
| --- | --- | --- |
| 1 | All Data | no filtering applied |
| 2 | Custom Data | limited to data created by users in the departments configured for this role in `sys_role_dept` |
| 3 | Own Department | limited to data created by users in the current user's department |
| 4 | Own Department and Below | same as 3, plus every department beneath it (matched against `sys_dept.dept_path`) |
| 5 | Own Data Only | limited to data the current user created themselves |

The decision is made from the logged-in user: `sys_user` joined with `sys_role` yields `data_scope`, `dept_id` and `role_id`, which are used to build the query condition.

## The Global Switch

Data permissions are gated by `application.enabledp`:

```yml
settings:
  application:
    # data permission feature switch
    enabledp: true
```

**When it's off (the default, `false`), no filtering happens at all** — every role sees every row regardless of its configured data scope. This is the first thing to check when "data permissions aren't working".

## Enabling It in Your Own Module

### Actions Pattern

Just hang `actions.PermissionAction()` on the route — the generic Action applies the filter automatically:

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

`PermissionAction()` puts the current user's data-permission info into the request context; the Actions after it read it back out and fold it into the query. **Skip this middleware and the filter never applies.**

### Hand-Written Pattern

Writing your own Handler and Service takes three steps.

The Api layer pulls the data permission out and passes it to Service:

```go
// data permission check
p := actions.GetPermissionFromContext(c)

list := make([]models.SysApi, 0)
var count int64
err = s.GetPage(&req, p, &list, &count)
```

The Service method accepts it and adds it to `Scopes`:

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

The route still needs `actions.PermissionAction()` on it.

## What It Requires in the Schema

Data permissions depend on these fields and tables — all of them:

| Object | Purpose |
| --- | --- |
| the business table's `create_by` | the filter key, records who created the row |
| `sys_user.dept_id` | the user's department |
| `sys_role.data_scope` | the role's configured data scope |
| `sys_dept.dept_path` | the department hierarchy path; "own department and below" depends on it |
| `sys_role_dept` | maps role to department for "custom data" |

As long as a business table follows the [database table conventions](/en-US/intro/advanced/db) and includes the common fields, `create_by` is filled in automatically by the framework on write — no manual assignment needed.

:::warning
The filter runs on `create_by`, so **data imported straight into the database, or written by code that bypasses the framework, can end up with an empty `create_by`** — and that data becomes invisible to everyone under any scope except "All Data".

Backfill `create_by` when importing historical data.

:::

## Checklist for "The Data's There but I Can't See It"

The most common symptom once data permissions are active is "there's clearly data, but the query returns nothing." Check, in this order:

1. **Is `enabledp` actually `true`?** — When it's off, everyone sees everything; if the symptom is "seeing things I shouldn't", this is where to look;
2. **What data scope does the current account's role have?** — Check in Role Management; scope 5 only shows what that user created themselves;
3. **What's the target row's `create_by`?** — Query the database directly to confirm whether it's empty or belongs to the expected user;
4. **Is `actions.PermissionAction()` on the route?** — Skip it and filtering doesn't apply — the symptom then runs the other way: everyone sees everything;
5. **Is the department hierarchy right?** — With "own department and below", check that `sys_dept.dept_path` is correct; a wrong path means subordinate departments won't match.

:::info
While debugging, `e.Orm.Debug()` in the Service temporarily prints the actual SQL being run — seeing the assembled filter condition directly is much faster than guessing your way through each layer.

:::

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
