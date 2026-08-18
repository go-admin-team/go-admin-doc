---
title: 快速开始
order: 20
toc: content
---

`go-admin`是一个前后端分离的项目，所以需要分别下载 [前端项目 go-admin-ui](https://github.com/go-admin-team/go-admin-ui) 和 [后端项目 go-admin](https://github.com/go-admin-team/go-admin) ，下面分为两个阶段分别说明[前端项目 go-admin-ui](https://github.com/go-admin-team/go-admin-ui)和[后端项目 go-admin](https://github.com/go-admin-team/go-admin)的快速启动；

## 环境准备<Badge>go-admin</Badge>

:::info
请注意 Go version >= 1.26（以仓库 `go.mod` 中的声明为准），并且 GO111MODULE=on (Go Module 模式)；
:::

[如需配置 go 环境变量请进入](/guide/env)

## Api 项目下载<Badge>go-admin</Badge>

```bash
# 工作目录
$ mkdir myproject && cd myproject

# clone
$ git clone https://github.com/go-admin-team/go-admin.git

# 编译
$ cd ./go-admin
$ go mod tidy
$ go build
```

## 配置数据源<Badge>go-admin</Badge>

1. 直接使用仓库自带的配置文件，修改`config/settings.yml`中的数据源配置即可。
1. 或者复制一份另行命名（例如`config/settings.dev.yml`），启动时通过 `-c` 参数指定，便于区分多套环境。

<img class="no-margin" src="https://doc-image.zhangwj.com/img/configv1.1.0.png"  height="400px" style="margin:0 auto;">

```yml
database:
  # 数据库类型 mysql，sqlite3， postgres
  driver: mysql
  # 数据库连接字符串 mysql 缺省信息 charset=utf8&parseTime=True&loc=Local&timeout=1000ms
  source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
```

:::warning
**使用 sqlite3 时必须带构建标签**，否则启动即 panic：

```bash
$ go build -tags sqlite3
# 或直接运行
$ go run -tags sqlite3 . server -c config/settings.yml
```

原因是 `common/database/open.go` 带有 `//go:build !sqlite3`，不加标签时编译进
的是不含 sqlite3 驱动的版本，运行时在空函数上崩溃。**报错信息不会提到构建
标签**，容易误判为环境问题。`Makefile` 中的 `build-sqlite` 目标即为此准备。

mysql 与 postgres 无此问题。
:::

:::warning
Mysql 版本 8.0+ ，在此版本下最优；
其他低版本的会出现`Error 1071: Specified key was too long; max key length is 1000 bytes`等这类问题；请根据本地数据库版本进行对应修改；

:::

报错原因：

`mysql`在创建单列索引的时候对列的长度是有限制的`myisam`和`innodb`存储引擎下长度限制分别为`1000 bytes`和`767 bytes`。

解决方法：

```sh
# 编辑配置文件
vim /etc/my.cnf

# 在[mysqld] 下面添加MySQL默认的引擎设置
default-storage-engine=InnoDB

# 重启服务
service mysqld restart
```

删除库中迁移出的表，再次执行迁移命令，即可成功

## 创建数据库

在开发环境下，建议使用 docker 来创建数据库：

```
docker run --name mysql -p3306:3306 -d -e MARIADB_ROOT_PASSWORD=123456 mariadb:latest
```

然后可以使用账号 root/密码 123456 来访问本地的数据库:

```
mysql -h 127.0.0.1 -p123456 -e 'create database dbname default charset utf8'
```

:::info
创建的数据库默认字符集需要是 utf8。

:::

## 数据初始化<Badge>go-admin</Badge>

项目中支持使用命令方式初始化基本数据结构和基础数据。 可以方便的使用 `migrate` 命令进行项目数据库结构和数据初始化。如下操作：

```bash
# 初始化
# macOS or linux 下使用
$ go run main.go migrate -c config/settings.yml

# windows 下使用
$ go run main.go  migrate -c config\settings.yml
```

:::info
仓库自带的配置文件是 `config/settings.yml`。如果需要本地多环境隔离，可以自行复制一份并通过 `-c` 参数指定，例如开发环境命名为 `config/settings.dev.yml`。
:::

## 启动服务<Badge>go-admin</Badge>

初始化完成之后，我们就已经迫不及待启动项目了，我们尝试一下 `./go-admin server`

```bash
# 启动服务
# macOS or linux 下使用
$ go run main.go  server -c config/settings.yml

# windows 下使用
$ go run main.go  server -c config\settings.yml
```

如果看到一下数据内容，请检查一下数据库配置；

```bash
2020-07-31 16:09:41.989 [INFO] Logger init success!
2020-07-31 16:09:41.990 [INFO] mysql-drive.go:20: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
2020-07-31 16:09:44.350 [FATA] mysql-drive.go:23: mysql connect error : dial tcp 127.0.0.1:3306: connect: connection refused
```

输出内容为下图，恭喜你！你已经成功了！

<img src="https://doc-image.zhangwj.com/img/serversuccessv1.1.0.png"  height="400px" style="margin:0 auto;">

go，下一步启动前端项目！

:::warning
这里接下来是第二两个阶段了；

:::

## 验证环境<Badge>go-admin-ui</Badge>

前端项目要求 Node 22 及以上、pnpm 9 及以上（以 `package.json` 中的 `engines`
字段为准）：

```bash
$ node -v
v22.14.0

$ pnpm -v
9.15.1
```

:::warning
项目使用 **pnpm** 管理依赖，仓库中提交的是 `pnpm-lock.yaml`。
用 npm 或 yarn 安装会忽略该锁文件，可能装到与 CI 不一致的依赖版本。

若尚未安装 pnpm：`npm install -g pnpm`，或使用 Node 自带的
`corepack enable`。
:::

[如需安装 node 进入](/guide/vue-install)

然后，退出`go-admin`项目目录，我们建议`go-admin`项目文件根目录和`go-admin-ui`项目文件根目录，放在同一级目录下。

```bash
$ ls
go-admin      go-admin-ui

# 返回到 dirname 文件夹
$ cd ../
```

## View 项目下载<Badge>go-admin-ui</Badge>

这里我们直接`git clone`下来。

```bash
# clone
$ git clone https://github.com/go-admin-team/go-admin-ui.git
```

输出内容：

```bash
$ git clone https://github.com/go-admin-team/go-admin-ui.git
Cloning into 'go-admin-ui'...
...
Receiving objects: 100% (584/584), 580.92 KiB | 16.00 KiB/s, done.
Resolving deltas: 100% (127/127), done.
```

> 恭喜！到目前为止说明 go-admin-ui 代码已经下载完成。

## 安装依赖<Badge>go-admin-ui</Badge>

```bash
$ cd go-admin-ui/

$ pnpm install

# 国内网络较慢时可指定镜像源
$ pnpm install --registry=https://registry.npmmirror.com
```

:::info
这里还原包是需要一些时间的请耐心等待一下...

:::

看到类似下面输出内容说明已经安装好了

```bash
Packages: +1653
Progress: resolved 1653, reused 1653, downloaded 0, added 1653, done

Done in 21.4s
```

## view 启动<Badge>go-admin-ui</Badge>

启动项目，使用`pnpm dev`命令就好了。

```bash
# 启动页面
$ pnpm dev
```

输出内容：

```bash
  VITE v8.2.1  ready in 722 ms

  ➜  Local:   http://localhost:9527/
  ➜  Network: use --host to expose
```

:::info
需要局域网内其他设备访问时，执行 `pnpm dev --host`。
:::

:::info
此时项目已经启动了，但是有一点请注意：检查 go-admin 是否也启动了。否则页面会提示错误的哦。

:::

## 构建及部署

构建开始，执行 `pnpm build:prod`

```bash
# 编译项目
$ pnpm build:prod

vite v8.2.1 building for production...
✓ built in 18.42s
```

构建产物默认生成到 ./dist 下，然后通过 tree 命令查看，(windows 用户可忽略此步）

测试环境验证，将 `./dist` 文件上传到测试环境中进行验证。

部署，将测试后的 `./dist` 文件上传到最终环境或者生产环境。

:::warning
从哪里获得帮助：
如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。
:::
