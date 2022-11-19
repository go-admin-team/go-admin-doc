---
nav:
  title: 指令
  order: 3
title: app
order: 20
toc: content
---

## 创建 app

`go-admin` 为了使项目中的结构和思路更清晰，也方便大家对自己的项目做分类管理，特别提出了 app 的这个概念，下载项目后，尽量不要去更改 admin 项目中的代码，方便以后跟随版本的升级，只专注自己的业务就好，所以我们给出了一个`app`的指令。

:::warning 指令更改
从 2.1.\*开始`createapp`指令变更为`app`，和订阅版保持一致。
:::

我们可以使用`app`指令创建一个新的 app，下边创建一个`appname`在实际使用中大家需要根据自己的业务名称修改替换。

```sh
$ ./go-admin app -n appname
```

这样我们就在`go-admin`项目`app`目录下创建了一个新的文件夹，这个时候就可以往这个目录中生成业务代码了；同时还会自定将模块注册到 go-admin 启动项中。
