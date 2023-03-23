---
nav: 开发
group:
  title: 示例
  order: 3
title: 简单示例
order: 5
toc: content
---


## 创建文章功能

现在你的开发环境，已经配置好了，你可以开始干活了。

在 go-admin 中，你只需要关注业务，不用再为基础功能操心，这样你就能专心写代码，而不是想着如何组建项目，如何设计权限管理，如何选择 UI，在这里没有如何如何。

刚才已经讲过了项目的目录结构，在这里就不在赘述。

---

## 编写第一个接口

在 `apis` 目录中创建 `article.go` 文件

```go
package apis

import (
 "github.com/gin-gonic/gin"
 "go-admin/common/apis"
)

type Article struct {
 apis.Api
}

// GetArticleList 获取文章列表
func (e Article)GetArticleList(c *gin.Context) {
 err := e.MakeContext(c).
  Errors
 if err != nil {
  e.Logger.Error(err)
  return
 }
 e.OK("hello world ！","success")
}
```

这是 go-admin 中最简单的接口。如果想看见效果，我们需要将一个 URL 映射到它——这就是我们需要 router 的原因了。

以下是程序的目录结构：

```bash
go-admin
  app
    admin
      apis
      models
      router
      service
        dto
```

在 `go-admin/app/admin/router/article.go` 中，输入以下代码：

```go
package router

import (
 "go-admin/app/admin/apis"

 "github.com/gin-gonic/gin"
 jwt "github.com/go-admin-team/go-admin-core/sdk/pkg/jwtauth"
)

func init() {
 routerCheckRole = append(routerCheckRole, registerArticleRouter)
}

// 需认证的路由代码
func registerArticleRouter(v1 *gin.RouterGroup, authMiddleware *jwt.GinJWTMiddleware) {
 api:= apis.Article{}
 r := v1.Group("")
 {
  r.GET("/articleList", api.GetArticleList)
 }
}
```

现在已经把接口函数注册到了 router 里边，通过以下命令验证是否正常工作：

```bash
go build

./go-admin server -c=config/settings.dev.yml
```

用你的浏览器访问 <http://localhost:8000/api/v1/articleList>，你应该能够看见

```json
{
  "requestId": "4085aca9-1ea2-4088-8e26-8ba0bc4e8bdb",
  "code": 200,
  "msg": "success",
  "data": "hello world ！"
}
```

这是你在接口中定义的。

:::warning
404 page not found
<br />
如果你在这里得到了一个错误页面，检查一下你是不是正访问着 http://localhost:8000/api/v1/articleList 而不应该是 http://localhost:8000/。

:::

router 注册类型，我们比较常用的就是 `GET`、`POST`、`PUT`、`DELETE`等

这些函数的两个必须参数： path 和 handlers 。现在是时候来研究这些参数的含义了。

### path

path 是一个匹配 URL 的准则（有点正则表达式的意思），当 go-admin 响应一个请求时，它会从注册的 url 第一项开始，按照顺序一次匹配，直到找到匹配项。

这些准则不会匹配 GET 和 POST 参数或域名。例如，URL 在处理请求 <http://www.zhangwj.com/articleList> 时，它会尝试匹配 articleList 。处理请求 <http://www.zhangwj.com/articleList?page=3> 时，也只会尝试匹配 blog/list。

<!-- :::error -->

path 也支持带参数的写法，例如 <code>r.GET("/articleList/:id",apis.GetArticleList)</code>, 这个时候会按照这 <code>/articleList/:id</code> 进行匹配 <code>:id</code> 可以是字符串，可以是数字等任意字符，当然也是可以限制的，这里我们不再展开。

:::

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
