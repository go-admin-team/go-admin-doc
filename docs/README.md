---
home: true
heroImage: /home.png
title: a
actionText: 快速上手 →
actionLink: /guide/
features:
  - title: 简单快捷
    details: 基于Gin的权限管理系统 易读易懂、界面简洁美观,提供前端Vue、后端Gin完全分离的权限管理系统,5分钟既可以实现一个应用
  - title: 技术栈
    details: 使用 gin/vue/react 等技术开发 合理的框架选择，良好的工程实践助你持续产出高质量代码 基于Casbin的 RBAC 访问控制模型
  - title: 代码生成
    details: 在线配置表信息生成对应的代码，增删改查/排序/导出/权限控制等直接使用
footer: MIT Licensed | Copyright © 2020-present wenjianzhang
---

## 5 分钟上手 go-admin

```bash
# 创建目录
$ mkdir myproject && cd myproject

# clone 项目
$ git clone https://github.com/go-admin-team/go-admin.git

# 进入go-admin根目录
$ cd ./go-admin

# 编译server
$ go build

# 修改数据库连接
$ vi config/settings.yml

# database:
#     # 数据库类型 mysql
#     driver: mysql
#     # 数据库连接字符串 mysql 缺省信息 charset=utf8&parseTime=True&loc=Local&timeout=1000ms
#     source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms

# 初始化数据库
# macOS or linux 下使用
$ ./go-admin migrate -c=config/settings.dev.yml

# ⚠️注意:windows 下使用
$ go-admin.exe migrate -c=config/settings.dev.yml

# 启动服务
# macOS or linux 下使用
$ ./go-admin server -c=config/settings.yml

# ⚠️注意:windows 下使用
$ go-admin.exe server -c=config/settings.yml
```

:::tip ⚠️ 注意
在 windows 环境中会出现这个问题；

```bash
E:\go-admin>go build
# github.com/mattn/go-sqlite3
cgo: exec /missing-cc: exec: "/missing-cc": file does not exist
```

or

```bash
D:\Code\go-admin>go build
# github.com/mattn/go-sqlite3
cgo: exec gcc: exec: "gcc": executable file not found in %PATH%
```

[解决 cgo 问题进入](/guide/other/faq.html#_5-cgo-exec-missing-cc-exec-missing-cc-file-does-not-exist)

:::

## 反馈

| Github Issue                                                        | 微信群                                                                           | QQ 群                                                                             |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [go-admin/issues](https://github.com/go-admin-team/go-admin/issues) | <img src="https://gitee.com/mydearzwj/image/raw/master/img/wx.png" width="60" /> | <img src="https://gitee.com/mydearzwj/image/raw/master/img/qq2.png" width="60" /> |
