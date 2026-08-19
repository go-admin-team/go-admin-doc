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
title: 菜单绑定接口
order: 4
toc: content
description: go-admin 将生成的接口登记到接口管理并与菜单绑定，为角色授权做准备。
keywords: [go-admin 接口管理, 菜单绑定接口, sys_api 登记]
---


## 配置系统菜单绑定接口

1. 首先需要将新增的 api 自动托管到接口管理中,

按照一下命令直接操作即可；

```sh
$ go run main.go server -c config/settings.yml -a
```

`server` 命令中我们新追加了`-a`参数，它是一个开关参数：不传时默认关闭，传入 `-a` 即开启，
开启后会对当前程序所有的 api 进行检查并创建；

:::warning
`-a` 是布尔开关，写成 `-a true` 或 `-a false` 都不是正确用法：
`true` / `false` 不会被当作参数值，而会被当成多余的位置参数。
需要关闭时不传该参数即可。

:::

2. 进入「系统管理 → 接口管理」，能看到刚才登记进来的接口，按需编辑接口名称、分组等信息，与菜单对应，方便下一步授权时识别。

