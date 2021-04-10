# 编写 go-admin 应用,第 1 步

让我们通过示例来学习。

通过这个教程，我们将带着你创建一个基本的文章管理程序。

它由两部分组成：

- 前端页面。

- 后端 api 服务。

我们假设你已经阅读了[开始](http://doc.zhangwj.com/go-admin-doc/guide/ksks.html)

## 开始项目

如果这是你第一次使用 go-admin 的话，你需要一些初始化设置。也就是说，你需要配置一个 go-admin 即一个项目实例需要的设置数据库或者也可以使用细目本身提供的 sqlite3 的体验数据库（部分功能不支持，如代码生成），目前推荐大家使用 mysql 数据库。

进入项目工作路径，打开 `config/settings.yml` 进行配置：

```yml
settings:
  application:
    # 项目启动环境
    mode: dev # dev开发环境 test测试环境 prod线上环境；
    host: 0.0.0.0 # 主机ip 或者域名，默认0.0.0.0
    # 服务名称
    name: go-admin
    # 服务端口
    port: 8000
    readtimeout: 1
    writertimeout: 2
  log:
    # 日志文件存放路径
    dir: temp/logs
  jwt:
    # JWT加密字符串
    secret: go-admin
    # 过期时间单位：秒
    timeout: 3600
  database:
    # 数据库名称
    name: dbname
    # 数据库类型
    dbtype: mysql
    # 数据库地址
    host: 127.0.0.1
    # 数据库密码
    password: password
    # 数据库端口
    port: 3306
    # 数据库用户名
    username: root
```

配置中，我们需要修改 `database` 下边的属性信息：

- database 数据库名称
- dbtype 数据库类型，支持 mysql
- host 数据库地址，填写网络 ip 地址或者域名。mysql，如：127.0.0.1；
- password 数据库密码
- port 数据库端口号
- username 数据库用户名

还需修改 `application` 下边的属性信息：

- logpath 日志文件路径，这里配置相对程序路径

:::tip 建议
你得避免使用 go 或 go-admin 的内部保留字来命名你的项目模块以等名称。避免产生组件冲突。
:::

:::tip 我的代码该放在哪？
如果是曾经是原生 PHP、JAVA、.Net 程序员，都会有项目标准的目录结构，当然 go-admin 也是相同的，也有自己的目录结构，这样利于项目更规范，协作更高效。
:::

让我们看一下 go-admin 的目录结构：

```bash
.
├── LICENSE.md
├── Makefile
├── README.en.md
├── README.md
├── _config.yml
├── apis
├── cmd
├── config
├── database
├── docs
├── go.mod
├── go.sum
├── handler
├── main.go
├── middleware
├── models
├── pkg
├── router
├── static
├── temp
│   └── logs
├── template
├── test
└── tools
```

这些目录和文件的用处是：

- 最外层 go-admin 是项目根路径
- apis： api
- config： 配置相关的文件以及类
- database： 数据持久层基类
- docs： 接口文档
- handler： 处理程序类
- models： 数据访问层
- pkg： 程序包
- router： 路由以及中间件
- statie： 上传静态文件
- temp： 临时日志文件
- middleware: 中间件
- template： 模板文件
- test： 测试
- tools 工具类
- main.go： 主入口

---

## 用于开发的服务器

让我们来确认一下你的 go-admin 项目是真的配置成功了。请运行下面的命令：

```bash
./go-admin server -c=config/settings.dev.yml
```

输出内容为下图，恭喜你！你已经成功了！

<img class="no-margin" src="
https://gitee.com/mydearzwj/image/raw/master/img/serversuccessv1.0.0.png"  height="500px" style="margin:0 auto;">

现在，服务器正在运行，浏览器访问 http://127.0.0.1:8000/。你将会看到 `go-admin` 文档，服务器已经运行了。

:::tip 更换端口
默认情况下，服务器设置为监听本机内部 IP 的 8000 端口。
如果你想更换服务器的监听端口，请使用命令行参数。举个例子，下面的命令会使服务器监听 8080 端口：

我们需要打开配置文件 `config/settings.yml`

```bash
application:
    port: 8000
```

如果你想要修改服务器监听的 IP，在端口之前输入新的。比如，为了监听所有服务器的公开 IP（这你运行 Vagrant 或想要向网络上的其它电脑展示你的成果时很有用），使用：

```bash
application:
    port: 8080
```

修改之后需要重启服务。

:::

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
	"go-admin/models"
	"net/http"
)

func GetArticleList(c *gin.Context) {

	var res models.Response
	res.Data = "hello world ！"

	c.JSON(http.StatusOK, res.ReturnOK())
}
```

这是 go-admin 中最简单的接口。如果想看见效果，我们需要将一个 URL 映射到它——这就是我们需要 router 的原因了。

以下是程序的目录结构：

```bash
go-admin
    apis
    config
    database
    docs
    handler
    models
    pkg
    router
    statie
    temp
    template
    test
    utils
    main.go
    sqlite3.db
```

在 `go-admin/router/router.go` 中，输入以下代码：

```go
func InitRouter() *gin.Engine {

    r := gin.New()

    r.GET("/articleList",apis.GetArticleList)

}
```

现在已经把接口函数注册到了 router 里边，通过以下命令验证是否正常工作：

```bash
go build

./go-admin server -c=config/settings.dev.yml
```

用你的浏览器访问 http://localhost:8000/articleList，你应该能够看见 "{"code":200,"data":"hello world ！","msg":""}" ，这是你在接口中定义的。

:::tip 404 page not found

如果你在这里得到了一个错误页面，检查一下你是不是正访问着http://localhost:8000/articleList 而不应该是 http://localhost:8000/。

:::

router 注册类型，我们比较常用的就是 `GET`、`POST`、`PUT`、`DELETE`等

这些函数的两个必须参数： path 和 handlers 。现在是时候来研究这些参数的含义了。

### path

path 是一个匹配 URL 的准则（有点正则表达式的意思），当 go-admin 响应一个请求时，它会从注册的 url 第一项开始，按照顺序一次匹配，直到找到匹配项。

这些准则不会匹配 GET 和 POST 参数或域名。例如，URL 在处理请求 http://www.zhangwj.com/articleList 时，它会尝试匹配 articleList 。处理请求 http://www.zhangwj.com/articleList?page=3 时，也只会尝试匹配 blog/list。

:::tip 注意
path 也支持带参数的写法，例如 `r.GET("/articleList/:id",apis.GetArticleList)`, 这个时候会按照这 `/articleList/:id` 进行匹配 `:id` 可以是字符串，可以是数字等任意字符，当然也是可以限制的，这里我们不再展开。
:::

当你了解了基本的请求和响应流程后，请阅读 教程的第 2 部分 开始使用数据库.

:::tip 从哪里获得帮助：
如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。
:::
