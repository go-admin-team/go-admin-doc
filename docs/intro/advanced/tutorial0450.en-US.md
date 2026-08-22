---
nav:
  title: Development
  order: 2
  second:
    title: Advanced
    order: 1
group:
  title: Code Generation
  order: 6
title: Configuring Role Permissions
order: 5
toc: content
description: Assigning the menu and API permissions of a newly generated module to a role in go-admin, based on Casbin's RBAC authorization.
keywords: [go-admin role permissions, casbin rbac configuration, admin permission assignment]
---

## Configuring Role Permissions

Go to Role Management and open the role list.

<img src="https://doc-image.zhangwj.com/img/setrole1v1.0.0.png" width="700xp" />

Pick the role to grant access to, click Edit, check the menu and API you just
generated, and save.

<img src="https://doc-image.zhangwj.com/img/setrole2v1.0.0.png" width="400xp" />

Refresh the page, and the menu you just authorized will appear in the sidebar.

<img src="https://doc-image.zhangwj.com/img/menu1v1.0.0.png" width="200xp" />

:::info
Signing in as the super admin won't tell you whether the authorization worked
— the `admin` role bypasses Casbin entirely and can call any API (see
[Authentication & Authorization](/en-US/intro/advanced/auth)). Whether a menu
appears in the sidebar depends on this role-to-menu assignment, which is a
separate mechanism from API-level permission checks — even the super admin
needs this step for the menu to show up.

To verify that permission enforcement itself actually works, test with a
non-super-admin account.

:::

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
