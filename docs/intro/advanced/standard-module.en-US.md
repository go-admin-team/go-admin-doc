---
nav:
  title: Development
  order: 2
  second:
    title: Advanced
    order: 1
group:
  title: Standard Practice
  order: 1
title: Standard Module Development
order: 1
toc: content
description: go-admin standard module development guide — use the common/actions generic Actions to implement single-table CRUD, a module needs only model, dto and router files, with app/demo as the compiled reference.
keywords: [go-admin module development, go-admin CRUD, gin rapid CRUD development, golang layered architecture]
---

# Standard Module Development<Badge>Beta</Badge>

:::warning
**This is an evolving pattern, marked Beta.**

Background in [Discussion #851](https://github.com/go-admin-team/go-admin/discussions/851):
the community is discussing removing the code generator in favour of **coding
conventions plus a compiled reference module** serving the same purpose. This
page describes that reference pattern.

That means:

- the directory structure and conventions here **may change as the discussion
  concludes**;
- the existing code generator still works — this page isn't a replacement for
  it, the two currently coexist;
- the reference code lives in the repository at `app/demo/` (backend) and
  `src/views/demo/` (frontend). Both compile, have tests, and run in CI —
  **where this page and the code disagree, the code wins**.
:::

## Why a Reference Module

Code produced by the generator drifts from its template the moment it's
generated, and the template itself never compiles, has no tests, and isn't run
by CI — problems in it usually surface only at runtime.

A reference module is the opposite: real, running code that lives in the
repository. Adding a module means copying and adapting it.

## Backend: Prefer the Generic Actions

Single-table CRUD **needs no hand-written Handler or Service**. The five
generic Actions in `common/actions` already cover parameter binding, data
permission filtering, operator injection, pagination, and error responses.

A complete module needs only three kinds of files:

```
app/demo/
├── models/demo_product.go        Model
├── service/dto/demo_product.go   DTO (Search / Control / ById)
└── router/demo_product.go        Routes + all CRUD
```

**No apis/, no service/.**

### Router

```go
func registerDemoProductRouter(v1 *gin.RouterGroup, authMiddleware *jwt.GinJWTMiddleware) {
    r := v1.Group("/demo-product").
        Use(authMiddleware.MiddlewareFunc()). // JWT authentication
        Use(middleware.AuthCheckRole())       // Casbin authorization
    {
        m := &models.DemoProduct{}

        r.GET("", actions.PermissionAction(), actions.IndexAction(m, new(dto.DemoProductSearch), func() interface{} {
            list := make([]models.DemoProduct, 0)
            return &list
        }))

        r.GET("/:id", actions.PermissionAction(), actions.ViewAction(new(dto.DemoProductById), func() interface{} {
            return &models.DemoProduct{}
        }))

        r.POST("", actions.CreateAction(new(dto.DemoProductControl)))
        r.PUT("/:id", actions.PermissionAction(), actions.UpdateAction(new(dto.DemoProductControl)))
        r.DELETE("", actions.PermissionAction(), actions.DeleteAction(new(dto.DemoProductById)))
    }
}
```

:::warning
**The list and detail routes must carry `actions.PermissionAction()`** — it
injects the data-permission context. Omitting it raises no error, but the data
scope configured on a role silently stops applying: a user ends up seeing data
they shouldn't.
:::

Routes self-register through `init()`, with no central file to register them
in:

```go
func init() {
    routerCheckRole = append(routerCheckRole, registerDemoProductRouter)
}
```

Scaffolding a new app with the built-in command also generates
`cmd/api/<name>.go`, which completes the registration:

```bash
$ go run main.go app -n <name>
```

### Model

```go
type DemoProduct struct {
    models.Model

    Name  string  `json:"name" gorm:"size:128;comment:名称"`
    Price float64 `json:"price" gorm:"comment:单价"`

    models.ControlBy   // CreateBy / UpdateBy
    models.ModelTime   // CreatedAt / UpdatedAt / DeletedAt
}

func (DemoProduct) TableName() string { return "demo_product" }

// Generate must return a copy
func (e *DemoProduct) Generate() models.ActiveRecord {
    o := *e
    return &o
}

func (e *DemoProduct) GetId() interface{} { return e.Id }
```

:::error
**`Generate()` must return a copy, never `e` itself.**

The generic Actions reuse the same model pointer across concurrent requests —
returning it in place lets data leak between requests: when two users submit
at the same time, one user's data can end up written into the other's record.

`app/demo`'s tests lock this behaviour in place; use them as a reference.
:::

`TableName()` must be declared explicitly — GORM is configured with
`SingularTable` and won't infer it.

Embedding `ControlBy` isn't optional either: data permissions
(`actions.Permission`) filter on `create_by`, and leaving it out breaks data
permissions entirely.

### DTO

Search conditions are declared via struct tags, which `MakeCondition` turns
into SQL:

```go
type DemoProductSearch struct {
    dto.Pagination `search:"-"`

    Name   string `form:"name" search:"type:icontains;column:name;table:demo_product"`
    Status string `form:"status" search:"type:exact;column:status;table:demo_product"`
}
```

`type` accepts: `exact` `iexact` `contains` `icontains` `gt` `gte` `lt` `lte`
`order` `left` (join).

The DTOs used for detail and delete only need to **embed `dto.ObjectById`** to
inherit `Bind` and `GetId` — no need to reimplement them:

```go
type DemoProductById struct {
    dto.ObjectById
}
```

## Frontend: the crud mixin for list pages

Pagination, search/reset, multi-select, the add/edit dialog, and delete
confirmation used to be written out fresh in every list page — identical
logic each time, differing only in the API functions and the primary-key field
name. In sys-post, roughly 8 of its 319 lines are this kind of boilerplate.

That's now collapsed into `@/mixins/crud`; a page only declares what's
different:

```js
import crud from '@/mixins/crud'
import { listProduct, getProduct, addProduct, updateProduct, delProduct } from '@/api/demo/product'

export default {
  name: 'DemoProduct',        // must match the backend menu's menu_name
  mixins: [crud],
  created() { this.getList() },
  methods: {
    crudOptions() {
      return {
        idKey: 'id',
        api: { list: listProduct, get: getProduct, add: addProduct, update: updateProduct, del: delProduct },
        defaultForm: () => ({ id: undefined, name: undefined, price: 0, status: '1' })
      }
    }
  }
}
```

State the mixin provides: `list` `total` `loading` `ids` `single` `multiple`
`open` `title` `form` `queryParams`

Methods the mixin provides: `getList` `handleQuery` `resetQuery`
`handleSelectionChange` `handleAdd` `handleUpdate` `handleDelete` `cancel`
`reset` `submitForm`

Use them directly in the page — don't reimplement them. A full example is at
`src/views/demo/product/index.vue`.

:::warning
**The component `name` must match the backend menu's `menu_name`.**

`keep-alive`'s `include` matches on component name, while the cache list
stores route names. A mismatch between the two silently breaks page caching,
with no error at all.
:::

## Menus and Permissions

Once the backend API is written, the page still won't show up in the menu —
four kinds of data are needed:

| Table | Purpose |
|---|---|
| `sys_api` | Registers the backend route; Casbin authorizes against this |
| `sys_menu` | The sidebar menu (directory M / menu C / button F) |
| `sys_menu_api_rule` | Links menus to APIs; used to generate policies when a role is saved |
| `casbin_rule` | The policies actually in effect |

These can be configured by hand in the UI, or written once via a migration.
A full example of the latter is at
`cmd/migrate/migration/version/1786700001000_demo_menu.go`.

:::warning
When writing a migration, target `casbin_rule`, not `sys_casbin_rule` — the
former is the table the adapter actually uses; the latter is a legacy
leftover, and its 7-column `size:512` unique index exceeds MySQL's index
length limit.
:::

Button permission keys follow the format `module:resource:action`, and must
match what's used in the frontend's `v-permisaction`:

```vue
<el-button v-permisaction="['demo:product:add']">Add</el-button>
```

## Development Convention Files

Both repositories carry an `AGENTS.md` at their root, recording rules that
**break something if not followed** — data permissions, `Generate()` returning
a copy, component-name consistency, FormData uploads, Vue 2 patterns that no
longer work, and so on.

It's written for AI coding tools and new contributors, deliberately kept
short, and doesn't restate stack versions (`go.mod` and `package.json` are
authoritative for those), to avoid drifting from the code.

Worth reading before adding a new module.

:::warning
Where to get help:
If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).
:::
