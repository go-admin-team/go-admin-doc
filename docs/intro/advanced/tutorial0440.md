---
nav: 开发
group:
  title: 代码生成
  order: 4
title: 菜单绑定接口
order: 4
toc: content
---


## 配置系统菜单绑定接口

1. 首先需要将新增的 api 自动托管到接口管理中,

按照一下命令直接操作即可；

```sh
$ go run main.go server -c config/settings.dev.yml -a false
```

`server` 命令中我们新追加了`-a`参数，默认情况下为`false`,当设置为`true`时，就会对当前程序所有的 api 进行检查并创建；

2. 进入接口管理，编辑新追加的接口信息，

