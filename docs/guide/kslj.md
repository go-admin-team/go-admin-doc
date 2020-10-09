# 项目简介

## 说明

go-admin 是基于 Gin + Vue + Element UI 的中后台管理系统开发脚手架。

- go-admin 在线 DEMO：[http://www.zhangwj.com](http://www.zhangwj.com)

- go-admin [在线文档国际](https://go-admin-team.github.io/go-admin-doc)

- go-admin [在线文档国内](http://mydearzwj.gitee.io/go-admin-doc/)

- go-admin [源码仓库国际](https://github.com/go-admin-team/go-admin)

- go-admin [源码仓库国内](https://gitee.com/mydearzwj/go-admin)

- QQ 群号： 74520518（已满）、521386980

go-admin 是一个 go 语言开发的企业级快速开发平台，使用了 Gin，casbin，gorm，Vue，Element UI，并且也内置了一些模块，如：用户管理、部门管理、角色用户、菜单及按钮授权、数据权限、系统参数、日志管理等。

## 特性

- 遵循 RESTful API 设计规范

- 基于 GIN WEB API 框架，提供了丰富的中间件支持（用户认证、跨域、访问日志、追踪 ID 等）

- 基于 Casbin 的 RBAC 访问控制模型

- JWT 认证

- 支持 Swagger 文档(基于 swaggo)

- 基于 GORM 的数据库存储，可扩展多种类型数据库

- 配置文件简单的模型映射，快速能够得到想要的配置

- 代码生成工具

- 表单构建工具

- TODO: 单元测试

## 内置

1.  用户管理：用户是系统操作者，该功能主要完成系统用户配置。
2.  部门管理：配置系统组织机构（公司、部门、小组），树结构展现支持数据权限。
3.  岗位管理：配置系统用户所属担任职务。
4.  菜单管理：配置系统菜单，操作权限，按钮权限标识等。
5.  角色管理：角色菜单权限分配、设置角色按机构进行数据范围权限划分。
6.  字典管理：对系统中经常使用的一些较为固定的数据进行维护。
7.  参数管理：对系统动态配置常用参数。
8.  操作日志：系统正常操作日志记录和查询；系统异常信息日志记录和查询。
9.  登录日志：系统登录日志记录查询包含登录异常。
10. 系统接口：根据业务代码自动生成相关的 api 接口文档。
11. 代码生成：根据数据表结构生成对应的增删改查相对应业务，全部可视化编程。
12. 表单构建：自定义页面样式，拖拉拽实现页面布局。
13. 服务监控：查看一些服务器的基本信息。

## 配置

1. 配置文件说明

```yml
settings:
  application:
    # dev开发环境 test测试环境 prod线上环境
    mode: dev
    # 服务器ip，默认使用 0.0.0.0
    host: 0.0.0.0
    # 服务名称
    name: testApp
    # 端口号
    port: 8000 # 服务端口号
    readtimeout: 1
    writertimeout: 2
    # 数据权限功能开关
    enabledp: false
  ssl:
    # https对应的域名
    domain: localhost:8000
    # https开关
    enable: false
    # ssl 证书key
    key: keystring
    # ssl 证书路径
    pem: temp/pem.pem
  logger:
    # 日志存放路径
    path: temp/logs
    # 控制台日志
    stdout: true
    # 日志等级
    level: all
    # 业务日志开关
    enabledbus: false
    # 请求日志开关
    enabledreq: false
    # 数据库日志开关 dev模式，将自动开启
    enableddb: false
  jwt:
    # token 密钥，生产环境时及的修改
    secret: go-admin
    # token 过期时间 单位：秒
    timeout: 3600
  database:
    # 数据库类型 mysql，sqlite3， postgres
    driver: mysql
    # 数据库连接字符串 mysql 缺省信息 charset=utf8&parseTime=True&loc=Local&timeout=1000ms
    source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
    # source: sqlite3.db
    # source: host=myhost port=myport user=gorm dbname=gorm password=mypassword
  gen:
    # 代码生成读取的数据库名称
    dbname: dbname
    # 代码生成是使用前端代码存放位置，需要指定到src文件夹，相对路径
    frontpath: ../go-admin-ui/src
```
