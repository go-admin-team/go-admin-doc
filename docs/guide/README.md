---
pageClass: getting-started
---

# 介绍

[go-admin](https://github.com/go-admin-team/go-admin) 是一个中后台应用框架，基于（gin, gorm, Casbin, Vue, Element UI）实现。go-admin 分为两个项目[go-admin](https://github.com/go-admin-team/go-admin) 和 [go-admin-ui](https://github.com/go-admin-team/go-admin-ui)，从名称上不难看出 go-admin 是后端服务，go-admin-ui 是 view 端服务。go-admin 主要提供一套标准化结构，让开发程序是对整个后端更加清晰彻底，也逐渐形成了独有的一套流程。

go-admin 目的是为了让开发者更方便快捷的梳理需求，专注业务，减少重复代码的编写，节省时间，提升人效，缩短项目周期，提升软件的开发效率以及质量，以早日实现不用加班的目的而努力！

## 仓库

- go-admin 在线 DEMO：[https://www.go-admin.dev](https://www.go-admin.dev)

- go-admin [在线文档](https://doc.go-admin.dev)

- go-admin [源码仓库国际](https://github.com/go-admin-team/go-admin)

- go-admin [源码仓库国内](https://gitee.com/mydearzwj/go-admin)

## 特性

- 开箱即用

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

## 内置功能

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

## 体验环境

1. 体验地址： [https://www.go-admin.dev](https://www.go-admin.dev)
2. 账号密码：admin/123456

## Contribution

本文档项目地址 [go-admin-doc](https://doc.go-admin.dev) 基于 [vuepress](https://github.com/vuejs/vuepress)开发。

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
