# 常规模式

:::tip 说明
`go-admin`服务是存在两种处理模式的;

简单的 crud 可以直接使用 `actions模式`【已移除】；

复杂的业务可以使用 `常规模式`；
:::

首先说明一下结构：
这里只是针对`app`文件夹说明；

```bash
.
└── admin
    ├── apis
    ├── models
    ├── router
    └── service
```

admin：可以理解成一个 project

apis：是 project 的 api 文件

models：是 project 的数据库层的模型

router：是 project 的路由

service：是 project 的业务逻辑处理

service.dto：是 project 的 api 对应的数据接收以及解析模型

搞清楚了这些我们开始往下进行；

直接使用项目中的源代码进行说明：我们操作日志为例；

按照 models、service.dto、service、apis、router 这个顺序来说明；

以上几个模块可以分别对应查看。
