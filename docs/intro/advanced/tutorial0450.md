---
nav:
  title: 开发
  order: 2
  second:
    title: 进阶
    order: 1
group:
  title: 代码生成
  order: 6
title: 配置角色权限
order: 5
toc: content
description: go-admin 为角色分配新生成模块的菜单与接口权限，基于 Casbin 的 RBAC 授权。
keywords: [go-admin 角色权限, casbin rbac 配置, 后台权限分配]
---

## 配置角色权限

进入角色管理，打开角色列表。

<img src="https://doc-image.zhangwj.com/img/setrole1v1.0.0.png" width="700xp" />

选择需要授权的角色，点击修改，勾选刚才生成的菜单以及 API 接口，保存。

<img src="https://doc-image.zhangwj.com/img/setrole2v1.0.0.png" width="400xp" />

刷新页面，刚刚授权的菜单就会出现在侧边栏。

<img src="https://doc-image.zhangwj.com/img/menu1v1.0.0.png" width="200xp" />

:::info
用超级管理员账号登录时看不出授权是否生效——`admin` 角色不经过 Casbin 检查，任何接口都能调用，见[认证与鉴权](/intro/advanced/auth)。菜单是否出现在侧边栏，依据的是这里的角色-菜单分配，与 API 层面的权限检查是两回事，即便是超级管理员也需要走这一步。

要验证权限控制本身是否生效，用一个非超级管理员账号测试。

:::

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
