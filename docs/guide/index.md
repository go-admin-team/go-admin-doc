---
title: 介绍
order: 10
toc: menu
nav:
  title: 指南
  order: 1
---

## 介绍

[go-admin](https://github.com/go-admin-team/go-admin) 是一个中后台应用框架，基于（gin, gorm, Casbin, Vue, Element UI）实现。go-admin 分为两个项目[go-admin](https://github.com/go-admin-team/go-admin) 和 [go-admin-ui](https://github.com/go-admin-team/go-admin-ui)，从名称上不难看出 go-admin 是后端服务，go-admin-ui 是 view 端服务。go-admin 主要提供一套标准化结构，让开发程序是对整个后端更加清晰彻底，也逐渐形成了独有的一套流程。

[go-admin](https://github.com/go-admin-team/go-admin)的目的是为了让开发者更方便快捷的梳理需求，专注业务，减少重复代码的编写，节省时间，提升人效，缩短项目周期，提升软件的开发效率以及质量，以早日实现不用加班的目的而努力！

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

3. pro 体验地址： [https://preview.go-admin.dev](https://preview.go-admin.dev)
4. 账号密码：admin/123456

## 贡献者

<span style="margin: 0 5px;" ><a href="https://github.com/wenjianzhang" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/3890175?v=4&h=60&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/G-Akiraka" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/45746659?s=64&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/lwnmengjing" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/12806223?s=64&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/bing127" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/31166183?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/chengxiao" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/1379545?s=64&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/NightFire0307" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/19854086?v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/appleboy" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/21979?s=64&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/ninstein" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/580303?v=4&h=60&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/kikiyou" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/17959053?s=64&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/horizonzy" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/22524871?s=64&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/Cassuis" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/48005724?s=64&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/hqcchina" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/5179057?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/nodece" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/16235121?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/stephenzhang0713" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/18169290?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/zhouxixi-dev" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/100399679?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/Jalins" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/31172582?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/wkf928592" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/6063351?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/wxxiong6" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/6983441?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/Silicon-He" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/52478309?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/GizmoOAO" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/20385106?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/bestgopher" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/36840497?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/wxb1207" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/20775558?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/misakichan" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/16569274?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/zhuxuyang" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/19301024?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/mss-boot" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/109259065?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/AuroraV" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/37330199?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/Vingurzhou" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/57127283?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/haimait" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/40926384?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/zyd" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/3446278?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/infnan" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/38274826?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/d1y" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/45585937?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/qlijin" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/515900?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/logtous
" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/88697234?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/stepway
" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/9927079?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/NaturalGao
" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/43291304?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>

## 建议反馈

本文档项目地址 [go-admin-doc](https://doc.go-admin.dev) 基于 [dumi](https://d.umijs.org/)开发。

有任何修改和建议都可以该项目 pr 和 issue

[go-admin](https://github.com/go-admin-team/go-admin) 还在持续迭代中，逐步沉淀和总结出更多功能和相应的实现代码，总结中后台产品快速开发脚手架。本项目也十分期待你的参与和[反馈](https://github.com/go-admin-team/go-admin/issues)。

## 互动交流

<table>
  <tr>
    <td><img src="https://doc-image.zhangwj.com/img/wx.png" width="180px"></td>
    <td><img src="https://raw.githubusercontent.com/wenjianzhang/image/master/img/qq.png" width="200px"></td>
    <td><img src="https://raw.githubusercontent.com/wenjianzhang/image/master/img/qq2.png" width="200px"></td>
  </tr>
  <tr>
    <td>微信</td>
    <td><a target="_blank" href="https://shang.qq.com/wpa/qunwpa?idkey=1affb445445bd442312fcad9a927007db74a0cd4380bbc08a6c97d2691744869"><img border="0" src="https://pub.idqqimg.com/wpa/images/group.png" alt="go-admin技术交流甲号" title="go-admin技术交流甲号"></a>已满</td>
    <td><a target="_blank" href="https://shang.qq.com/wpa/qunwpa?idkey=0f2bf59f5f2edec6a4550c364242c0641f870aa328e468c4ee4b7dbfb392627b"><img border="0" src="https://pub.idqqimg.com/wpa/images/group.png" alt="go-admin技术交流乙号" title="go-admin技术交流乙号"></a></td>
  </tr>
</table>

<Alert type="warning">
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

</Alert>
