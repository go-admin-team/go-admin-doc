---
title: 介绍
order: 10
nav:
  title: 指南
  order: 1
description: go-admin 是基于 Gin、GORM、Casbin 与 Vue 3 的开源中后台框架，提供用户、角色、菜单、部门、字典、定时任务等开箱即用的模块，遵循 RESTful 规范。
keywords: [go-admin 是什么, golang 中后台框架, gin gorm casbin, 开源权限管理系统]
---

## 介绍

[go-admin](https://github.com/go-admin-team/go-admin) 是一个中后台应用框架。后端基于 Gin、GORM、Casbin，前端基于 Vue 3 + Element Plus，另有 Arco Design 与 Ant Design 版本可选。

项目由两个仓库组成：[go-admin](https://github.com/go-admin-team/go-admin) 是后端服务，[go-admin-ui](https://github.com/go-admin-team/go-admin-ui) 是前端。框架提供一套标准化的分层结构与开发流程，使项目在规模变大后仍然保持清晰。

它要解决的是重复劳动。认证、权限、用户与部门管理这些每个后台系统都要重做一遍的部分已经内置，接手一个新项目时可以直接从业务写起。

## 适用场景

go-admin 面向的是**有明确权限模型的企业内部系统**——管理后台、运营平台、业务中台这类需要区分角色、限定数据范围的场景。

以下情况适合使用：

- 需要 RBAC 角色权限，并按组织架构划分数据可见范围；
- 需要在同一套代码上服务多个租户；
- 表结构相对规整，大量功能是标准的增删改查，希望由代码生成器产出；
- 团队规模不大，希望省去搭建认证、权限、日志这类基础设施的时间。

以下情况需要斟酌：

- 面向 C 端的高并发服务——框架的重心在后台管理，不在高吞吐场景的优化；
- 已有成熟的权限体系与账号中心，接入成本可能高于收益。

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

- 单元测试（逐步补充中）

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

1. Element Plus Vue 3 体验地址：<https://vue.go-admin.pro>，账号密码：admin/123456
2. Ant Design 体验地址（go-admin-pro）：<https://antd.go-admin.pro>，账号密码：admin/123456

## 贡献者

<div>
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
<span style="margin: 0 5px;" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/48005724?s=64&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></span>
<span style="margin: 0 5px;" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/5179057?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></span>
<span style="margin: 0 5px;" ><a href="https://github.com/nodece" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/16235121?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/stephenzhang0713" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/18169290?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/zhouxixi-dev" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/100399679?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/Jalins" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/31172582?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/6063351?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></span>
<span style="margin: 0 5px;" ><a href="https://github.com/wxxiong6" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/6983441?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/52478309?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></span>
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
<span style="margin: 0 5px;" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/88697234?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></span>
<span style="margin: 0 5px;" ><a href="https://github.com/stepway
" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/9927079?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/NaturalGao
" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/43291304?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/DemoLiang
" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/23476007?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/jfcg
" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/1410597?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/Nicole0724
" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/10487328?s=60&v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>
<span style="margin: 0 5px;" ><a href="https://github.com/LineHank
" ><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/24223668?v=4&w=60&fit=cover&mask=circle&maxage=7d" /></a></span>

## 建议反馈

本文档站点为 <https://www.go-admin.pro>，源码仓库 [go-admin-doc](https://github.com/go-admin-team/go-admin-doc)，基于 [dumi](https://d.umijs.org/) 开发。

有任何修改和建议都可以该项目 pr 和 issue

[go-admin](https://github.com/go-admin-team/go-admin) 还在持续迭代中，逐步沉淀和总结出更多功能和相应的实现代码，总结中后台产品快速开发脚手架。本项目也十分期待你的参与和[反馈](https://github.com/go-admin-team/go-admin/issues)。

## 互动交流

<table>
  <tr>
    <td style="width:185px;">
      <img src="https://doc-image.zhangwj.com/img/wx.png" width="180px">
    </td>
    <td style="width: 185px;">
      <img src="https://doc-image.zhangwj.com/img/qrcode_for_gh_b798dc7db30c_258.jpg" width="180px">
    </td>
    <td style="width: 185px;">
      <img src="https://doc-image.zhangwj.com/img/qq.png" width="180px">
    </td>
    <td style="width: 185px;">
      <img src="https://doc-image.zhangwj.com/img/qq2.png" width="180px">
    </td>
    <td>
    <a href="https://space.bilibili.com/565616721">wenjianzhang</a>
    </td>
  </tr>
  <tr>
    <td>微信</td>
    <td>公众号🔥🔥🔥</td>
    <td><a target="_blank" href="https://shang.qq.com/wpa/qunwpa?idkey=1affb445445bd442312fcad9a927007db74a0cd4380bbc08a6c97d2691744869"><img border="0" src="https://pub.idqqimg.com/wpa/images/group.png" alt="go-admin技术交流甲号" title="go-admin技术交流甲号"></a>已满</td>
    <td><a target="_blank" href="https://shang.qq.com/wpa/qunwpa?idkey=0f2bf59f5f2edec6a4550c364242c0641f870aa328e468c4ee4b7dbfb392627b"><img border="0" src="https://pub.idqqimg.com/wpa/images/group.png" alt="go-admin技术交流乙号" title="go-admin技术交流乙号"></a></td>
    <td>哔哩哔哩🔥🔥🔥</td>
  </tr>
</table>

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
