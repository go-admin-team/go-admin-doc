# Go Modules

从 1.11 开始，Go 已经包含了对版本模块的支持，正如这里提出的那样。最初的原型 vgo 于 2018 年 2 月公布。 2018 年 7 月，版本化模块登陆 Go 主存储库。

从 Go 1.14 开始，模块支持被认为可以用于生产，并鼓励所有用户从其他依赖管理系统迁移到模块。

Go 1.16 针对 go Modules 变更

1. 模块模式 ( GO111MODULE=on) 是所有情况下的默认值
1. 命令不再修改 go.mod/go.sum 默认情况下 ( -mod=readonly)
1. go install pkg@version 是全局安装包/可执行文件的推荐方法
1. retract 可在 go.mod

## 关于 go.mod

`go.mod`是 Go 项目的依赖描述文件，有三个信息：

1. 当前项目名(module)是什么。每个项目都应该设置一个名称，当前项目中的包(package)可以使用该名称进行相互调用。
2. 项目 go 语言版本号
3. 当前项目依赖的第三方包名称。项目运行时会自动分析项目中的代码依赖，生成 go.sum 依赖分析结果，随后 go 编译器会去下载这些第三方包，然后再编译运行。

## 初始化 go.mod

::: tip
首先需要配置一下[环境变量](/guide/env.html)
:::

执行一下命令，初始化 go.mod 文件

```sh
$ go mod init HelloWorld
go: creating new go.mod: module HelloWorld
go: to add module requirements and sums:
        go mod tidy
```

![](https://gitee.com/mydearzwj/image/raw/master/img/gomod-step1.png)

go.mod 文件，内容如下：

![](https://gitee.com/mydearzwj/image/raw/master/img/gomod-step2.png)

其中，`HelloWorld`为当前项目的名称，可以随意设置。

就这样简单便完成了项目的 module 初始化。
