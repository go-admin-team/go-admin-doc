# 开发规范

## 引用规范

```go
import (
  "net/http"

  "github.com/gin-gonic/gin"

  "go-admin/tools/app"
  "go-admin/app/admin/models"
)
```

### 引用部分分类

1. 内置函数；
2. 外部函数；
3. 项目引用；

格式：每块内容需有明显的分割，这里我们使用空行进行分割；

## 目录及文件名

### app

`app` 此目录是存放不同的应用或者较大的应用模块；例如：`go-admin`内置了用户权限管理模块，因此，在 app 下有一个 admin 的文件夹；

### admin

`admin`是指`go-admin`内置的用户权限管理模块；

### apis

`apis` 目录下直接存放 api 文件，命名格式如下：

格式：apis/{name}.go

### models

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

# 文件名称

## 函数名

```go
// GetArticleList 获取文章列表
func GetArticleList(c *gin.Context) {
    ...
}
```

- 函数名备注：
  1. 分为前后两段：
     1. 第一段方法名称；
     2. 第二段备注说明；

## 路径以及文件名

全部小写英文字母，单词中间使用下划线隔开 `_` ；

```go
article_list
# 路经：内容为示例，并非有实际意义，只需参照格式
# 此目录在后续版本将考虑移除；

article_list.go
# 文件名：内容为示例，并非有实际意义，只需参照格式
```

## go 内置函数

### init

请勿自行使用系统内置`init`函数，如果执行顺序控制不当，可能会出现问题；
