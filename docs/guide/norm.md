# 开发规范

## 引用

```go
import (
  "net/http"

  "github.com/gin-gonic/gin"

  "go-admin/tools/app"
  "go-admin/app/admin/models"
)
```

- 引用部分分为三块：

  1. 内置函数；
  2. 外部函数；
  3. 项目引用；

- 格式：
  每块内容需有明显的分割，这里我们使用空行进行分割；

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

## 路经以及文件名

全部小写英文字母，单词中间使用下划线隔开 `_` ；

```go
article_list # 路经：内容为示例，并非有实际意义，只需参照格式
article_list.go # 文件名：内容为示例，并非有实际意义，只需参照格式
```

## 系统内置函数

### init

请勿自行使用系统内置`init`函数，如果执行顺序控制不当，可能会出现问题；
