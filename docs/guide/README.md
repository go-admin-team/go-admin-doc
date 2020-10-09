---
pageClass: getting-started
---

# 项目介绍

<a href="https://github.com/go-admin-team/go-admin">
  <img src="https://github.com/wenjgo-admin-teamianzhang/go-admin/workflows/build/badge.svg" alt="go-admin">
</a>

<a href="https://github.com/go-admin-team/go-admin">
  <img src="https://img.shields.io/github/license/mashape/apistatus.svg" alt="license">
</a>
  <a href="http://doc.zhangwj.com/go-admin-doc/donate/">
  <img src="https://img.shields.io/badge/%24-donate-ff69b4.svg" alt="donate">
</a>

[go-admin](https://github.com/go-admin-team/go-admin) 是一个中后台管理系统，基于（gin, gorm, Casbin, Vue, Element UI）实现。主要目的是为了让开发者更专注业务，减少重复代码的编写，节省时间，提升人效，缩短项目周期，提升软件的开发效率以及质量。

go-admin 是基于 Gin + Vue + Element UI 的中后台管理系统开发脚手架。

- go-admin 在线 DEMO：[http://www.zhangwj.com](http://www.zhangwj.com)

- go-admin [在线文档国际](https://go-admin-team.github.io/go-admin-doc)

- go-admin [在线文档国内](http://mydearzwj.gitee.io/go-admin-doc/)

- go-admin [源码仓库国际](https://github.com/go-admin-team/go-admin)

- go-admin [源码仓库国内](https://gitee.com/mydearzwj/go-admin)

- 微信群添加方法： 可以扫码添加作者微信添加 go-admin 交流群

## 在线体验

1. 体验地址： [http://www.zhangwj.com](http://www.zhangwj.com)
2. 账号密码：admin/123456

## 系统要求

- go 1.15
- mysql 5.5 及以上

<br/>

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

1. 用户管理：用户是系统操作者，该功能主要完成系统用户配置。
2. 部门管理：配置系统组织机构（公司、部门、小组），树结构展现支持数据权限。
3. 岗位管理：配置系统用户所属担任职务。
4. 菜单管理：配置系统菜单，操作权限，按钮权限标识等。
5. 角色管理：角色菜单权限分配、设置角色按机构进行数据范围权限划分。
6. 字典管理：对系统中经常使用的一些较为固定的数据进行维护。
7. 参数管理：对系统动态配置常用参数。
8. 操作日志：系统正常操作日志记录和查询；系统异常信息日志记录和查询。
9. 登录日志：系统登录日志记录查询包含登录异常。
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

## Contribution

本文档项目地址 [go-admin-doc](https://github.com/go-admin-team/go-admin-doc) 基于 [vuepress](https://github.com/vuejs/vuepress)开发。

有任何修改和建议都可以该项目 pr 和 issue

[go-admin](https://github.com/go-admin-team/go-admin) 还在持续迭代中，逐步沉淀和总结出更多功能和相应的实现代码，总结中后台产品快速开发脚手架。本项目也十分期待你的参与和[反馈](https://github.com/go-admin-team/go-admin/issues)。

## 互动交流

<table>
  <tr>
    <td><img src="https://gitee.com/mydearzwj/image/raw/master/img/wx.png" width="180px"></td>
    <td><img src="https://gitee.com/mydearzwj/image/raw/master/img/qq.png" width="200px"></td>
    <td><img src="https://gitee.com/mydearzwj/image/raw/master/img/qq2.png" width="200px"></td>
  </tr>
  <tr>
    <td>微信</td>
    <td><a target="_blank" href="https://shang.qq.com/wpa/qunwpa?idkey=1affb445445bd442312fcad9a927007db74a0cd4380bbc08a6c97d2691744869"><img border="0" src="https://pub.idqqimg.com/wpa/images/group.png" alt="go-admin技术交流甲号" title="go-admin技术交流甲号"></a>已满</td>
    <td><a target="_blank" href="https://shang.qq.com/wpa/qunwpa?idkey=0f2bf59f5f2edec6a4550c364242c0641f870aa328e468c4ee4b7dbfb392627b"><img border="0" src="https://pub.idqqimg.com/wpa/images/group.png" alt="go-admin技术交流乙号" title="go-admin技术交流乙号"></a></td>
  </tr>
</table>

欢迎大家进去微信或 qq 群交流沟通，同时也希望大家[提交建议](https://github.com/go-admin-team/go-admin/issues/new)
