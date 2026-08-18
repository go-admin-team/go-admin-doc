---
nav:
  title: 开发
  order: 2
  second:
    title: 进阶
    order: 1
group:
  title: 高级
  order: 2
title: 标准模块开发
order: 0
toc: content
description: go-admin 标准模块开发指南：使用 common/actions 通用 Action 实现单表 CRUD，一个模块只需 model、dto、router 三个文件，以 app/demo 为可编译参照。
keywords: [go-admin 模块开发, go-admin CRUD, gin 快速开发 CRUD, golang 分层架构]
---

# 标准模块开发<Badge>Beta</Badge>

:::warning
**这是一套正在推进中的写法，标注为 Beta。**

背景见 [Discussion #851](https://github.com/go-admin-team/go-admin/discussions/851)：
社区正在讨论移除代码生成器，改由**代码规范 + 可编译的参照模块**承担同样的职责。
本文描述的就是那套参照写法。

这意味着：

- 本文的目录结构与约定**可能随讨论结论调整**
- 现有的代码生成器仍然可用，本文不是它的替代品，两者目前并存
- 参照代码位于仓库中的 `app/demo/`（后端）与 `src/views/demo/`（前端），
  它们参与编译、有测试、CI 会跑 —— **本文与它们冲突时，以代码为准**
:::

## 为什么需要参照模块

代码生成器产出的代码一旦生成就脱离模板演进，而模板本身不参与编译、没有测试、
CI 不会跑，出问题往往要到运行时才发现。

参照模块相反：它是仓库里真实存在、能跑起来的代码。要新增一个模块，照着改就行。

## 后端：优先使用通用 Action

单表 CRUD **不需要手写 Handler 与 Service**。`common/actions` 提供的五个通用
Action 已经覆盖了参数绑定、数据权限过滤、操作人注入、分页与错误响应。

一个完整的模块只需三类文件：

```
app/demo/
├── models/demo_product.go        Model
├── service/dto/demo_product.go   DTO（Search / Control / ById）
└── router/demo_product.go        路由 + 全部 CRUD
```

**没有 apis/，没有 service/。**

### 路由

```go
func registerDemoProductRouter(v1 *gin.RouterGroup, authMiddleware *jwt.GinJWTMiddleware) {
    r := v1.Group("/demo-product").
        Use(authMiddleware.MiddlewareFunc()). // JWT 认证
        Use(middleware.AuthCheckRole())       // Casbin 鉴权
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
**列表与详情必须带 `actions.PermissionAction()`**，它负责注入数据权限上下文。
漏掉不会报错，但角色上配置的数据范围会静默失效 —— 用户能看到本不该看到的数据。
:::

路由通过 `init()` 自注册，不需要在任何中心文件登记：

```go
func init() {
    routerCheckRole = append(routerCheckRole, registerDemoProductRouter)
}
```

新建应用时用内置命令生成骨架，它会同时产出 `cmd/api/<名称>.go` 完成注册：

```bash
$ go run main.go app -n <名称>
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

// Generate 必须返回副本
func (e *DemoProduct) Generate() models.ActiveRecord {
    o := *e
    return &o
}

func (e *DemoProduct) GetId() interface{} { return e.Id }
```

:::error
**`Generate()` 必须返回副本，不能返回 `e` 本身。**

通用 Action 在并发请求之间复用同一个模型指针，就地返回会导致请求之间串数据 ——
两个用户同时提交时，一方的数据可能被写进另一方的记录。

`app/demo` 的测试锁定了这一点，可参照编写。
:::

`TableName()` 必须显式声明 —— GORM 配置了 `SingularTable`，不会自动推导。

内嵌 `ControlBy` 也不是可选的：数据权限（`actions.Permission`）正是按 `create_by`
过滤，缺少它会使数据权限失效。

### DTO

搜索条件由 tag 声明，`MakeCondition` 据此拼接 SQL：

```go
type DemoProductSearch struct {
    dto.Pagination `search:"-"`

    Name   string `form:"name" search:"type:icontains;column:name;table:demo_product"`
    Status string `form:"status" search:"type:exact;column:status;table:demo_product"`
}
```

`type` 可选值：`exact` `iexact` `contains` `icontains` `gt` `gte` `lt` `lte`
`order` `left`（联表）。

详情与删除用的 DTO **内嵌 `dto.ObjectById` 即可**继承 `Bind` 与 `GetId`，无需重写：

```go
type DemoProductById struct {
    dto.ObjectById
}
```

## 前端：列表页使用 crud mixin

分页查询、搜索重置、多选、新增/修改弹窗、删除确认这几段逻辑，此前在每个列表页
各写一遍，实现完全相同，仅接口函数与主键字段名不同。以 sys-post 为例，319 行
中约 8 个方法属于这类样板。

这些已收敛到 `@/mixins/crud`，页面只需声明差异部分：

```js
import crud from '@/mixins/crud'
import { listProduct, getProduct, addProduct, updateProduct, delProduct } from '@/api/demo/product'

export default {
  name: 'DemoProduct',        // 必须与后端菜单的 menu_name 一致
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

mixin 提供的状态：`list` `total` `loading` `ids` `single` `multiple` `open`
`title` `form` `queryParams`

mixin 提供的方法：`getList` `handleQuery` `resetQuery` `handleSelectionChange`
`handleAdd` `handleUpdate` `handleDelete` `cancel` `reset` `submitForm`

页面中直接使用，不要重复实现。完整示例见 `src/views/demo/product/index.vue`。

:::warning
**组件 `name` 必须与后端菜单配置的 `menu_name` 一致。**

`keep-alive` 的 `include` 按组件名匹配，而缓存名单里存的是路由名。两者不一致时
页面缓存会静默失效，没有任何报错。
:::

## 菜单与权限

后端接口写完，页面还不会出现在菜单里 —— 需要四类数据：

| 表 | 作用 |
|---|---|
| `sys_api` | 后端路由登记，Casbin 据此判定权限 |
| `sys_menu` | 侧边栏菜单（目录 M / 菜单 C / 按钮 F） |
| `sys_menu_api_rule` | 菜单与接口的关联，角色保存时据此生成策略 |
| `casbin_rule` | 实际生效的权限策略 |

可以在界面上手工配置，也可以写迁移一次性写入。后者的完整示例见
`cmd/migrate/migration/version/1786700001000_demo_menu.go`。

:::warning
写迁移时注意用 `casbin_rule` 而非 `sys_casbin_rule` —— 前者才是 adapter 实际
使用的表，后者是历史遗留，其 7 列 `size:512` 唯一索引在 MySQL 下会超出索引
长度限制。
:::

按钮权限标识格式为 `模块:资源:操作`，需与前端 `v-permisaction` 中的写法一致：

```vue
<el-button v-permisaction="['demo:product:add']">新增</el-button>
```

## 开发约定文件

两个仓库的根目录各有一份 `AGENTS.md`，记录**不遵守就会出错**的规则 ——
数据权限、`Generate()` 副本、组件名一致性、FormData 上传、Vue 2 失效写法等。

它面向 AI 编码工具与新贡献者，篇幅刻意控制得很短，不复述技术栈版本（以
`go.mod` 与 `package.json` 为准），避免与代码脱节。

新增模块前建议先读一遍。

:::warning
从哪里获得帮助：
如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。
:::
