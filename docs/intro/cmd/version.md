---
nav:
  title: 开发
  order: 2
  second:
    title: 指令
    order: 2
title: version
order: 60
toc: content
---

## 查看版本

`version` 指令用于输出当前二进制文件的 go-admin 版本号，常用于确认线上部署的版本与预期是否一致。

```sh
$ ./go-admin version
```

输出示例：

```
2.4.0
```

该指令没有额外参数，输出内容取自 `common/global/adm.go` 中的 `Version` 变量。

## 使用场景

1. **确认部署版本**：服务异常时，先确认线上运行的二进制版本，避免拿旧版本的行为去对照新版本的文档；
2. **提交 issue**：向 [go-admin issues](https://github.com/go-admin-team/go-admin/issues/new) 反馈问题时，附上该指令的输出，便于定位问题所属版本；
3. **升级校验**：升级完成后执行一次，确认新二进制已经生效。

:::info
源码运行时同样可以查看：

```sh
$ go run main.go version
```

:::

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
