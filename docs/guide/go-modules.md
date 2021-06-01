# Go Modules

从 1.11 开始，Go 已经包含了对版本模块的支持，正如这里提出的那样。最初的原型 vgo 于 2018 年 2 月公布。 2018 年 7 月，版本化模块登陆 Go 主存储库。

从 Go 1.14 开始，模块支持被认为可以用于生产，并鼓励所有用户从其他依赖管理系统迁移到模块。

Go 1.16 针对 go Modules 变更

1. 模块模式 ( GO111MODULE=on) 是所有情况下的默认值
1. 命令不再修改 go.mod/go.sum 默认情况下 ( -mod=readonly)
1. go install pkg@version 是全局安装包/可执行文件的推荐方法
1. retract 可在 go.mod
