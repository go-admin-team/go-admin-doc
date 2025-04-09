---
nav: 开发
group:
  title: 服务端基础
  order: 0
title: 服务启动
order: 3
toc: content
---

## api的启动

让我们来确认一下你的 go-admin 项目是真的配置成功了。请运行下面的命令：

```bash
go run main.go server -c=config/settings.dev.yml
```

输出内容为下图，恭喜你！你已经成功了！

<img src="https://doc-image.zhangwj.com/img/serversuccessv1.1.0.png" alt="服务器启动成功" width="400px" />

现在，服务器正在运行，浏览器访问 <http://127.0.0.1:8000/>。你将会看到 `go-admin` 文档，服务器已经运行了。

:::warning
更换端口
默认情况下，服务器设置为监听本机内部 IP 的 8000 端口。
如果你想更换服务器的监听端口，请使用命令行参数。举个例子，下面的命令会使服务器监听 8080 端口：

:::

我们需要打开配置文件 `config/settings.yml`

```bash
application:
    port: 8000
```

如果你想要修改服务器监听的 IP，在端口之前输入新的。比如，为了监听所有服务器的公开 IP（这你运行 Vagrant 或想要向网络上的其它电脑展示你的成果时很有用），使用：

```bash
application:
    port: 8080
```

修改之后需要重启服务。

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
