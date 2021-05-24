# 开发规范

## 目录及文件名

:::tip 注意
以下部分标准将在 v1.4.0 及之后版本生效。
:::

### app

`app` 此目录是存放不同的应用或者较大的应用模块；例如：`go-admin`内置了用户权限管理模块，因此，在 app 下有一个 admin 的文件夹；

### admin

`admin`是指`go-admin`内置的用户权限管理模块；

### apis

[v1.4.0+]

`apis` 目录下直接存放 api 文件，命名格式如下：

格式：apis/{name}.go

### models

[v1.4.0+]

`models` 目录下直接存放数据库 orm 模型文件，命名格式如下：

格式：models/{name}.go

### router

`router` 目录下直接存放路由文件，命名格式如下：

格式：router/{name}.go

### service

`service` 目录下直接存放业务处理文件，命名格式如下：

格式：service/{name}.go

### service/dto

`service/dto` 目录下存放 api 请求接收或者输出的模型文件，命名格式如下：

格式：service/dto/{name}.go

### name 示例

```go
article_list.go
# 文件名：内容为示例，并非有实际意义，只需参照格式
```

## Code 规范

### 引用部分分类

分类列表

1. 内置函数；
2. 外部函数；
3. 项目引用；

格式：每块内容需有明显的分割，这里我们使用空行进行分割；

示例：

```go
import (
  "net/http"

  "github.com/gin-gonic/gin"

  "go-admin/tools/app"
  "go-admin/app/admin/models"
)
```

### 函数名

格式：{操作类型}{函数名备注}：

1. 分为前后两段：

> 1.  第一段方法名称；Get
> 2.  第二段备注说明；ArticleList

示例：

```go
// GetArticleList 获取文章列表
func GetArticleList(c *gin.Context) {
    ...
}
```

## Router

### api

[v1.4.0+]

格式：`api/{version}/{module}/{name}`

示例：`api/v1/system/sys-user`

### view

[v1.4.0+]

格式：`{module}/{name}`

示例：`system/sys-user`

## go 内置函数

### init

请勿自行使用系统内置`init`函数，如果执行顺序控制不当，可能会出现问题；

## 系统配置

### 菜单管理

业务名称：list 、 add 、 remove 、 edit 、 query 、

#### 权限标识

请使用小驼峰

[v1.4.0+]

格式：`{module}/{name}/业务名称`

示例：`admin/sysUser/list`
