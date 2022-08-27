---
title: 快速开始
order: 20
toc: menu
---

<Alert type="warning">
因为`go-admin`是一个前后端分离的项目，所以需要分为下载[前端项目go-admin-ui](https://github.com/go-admin-team/go-admin-ui)和[后端项目go-admin](https://github.com/go-admin-team/go-admin)，下面分为两个阶段分别说明[前端项目go-admin-ui](https://github.com/go-admin-team/go-admin-ui)和[后端项目go-admin](https://github.com/go-admin-team/go-admin)的快速启动；

</Alert>

## 环境准备<Badge>go-admin</Badge>

<Alert type="info">
请注意 Go version >= 1.18，并且 GO111MODULE=on (Go MOdule 模式)；

</Alert>

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

1. 首先找到配置文件，`config/settings.yml`， 复制一份，并修改文件名为`config/settings.dev.yml` 即可。
1. 或者直接使用默认配置文件，直接修改`config/settings.yml`即可。

<img class="no-margin" src="https://raw.githubusercontent.com/wenjianzhang/image/master/img/configv1.1.0.png"  height="500px" style="margin:0 auto;">

```yml
database:
  # 数据库类型 mysql，sqlite3， postgres
  driver: mysql
  # 数据库连接字符串 mysql 缺省信息 charset=utf8&parseTime=True&loc=Local&timeout=1000ms
  source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
```

<Alert type="error">
Mysql 版本 8.0+ ，在此版本下最优；
其他低版本的会出现`Error 1071: Specified key was too long; max key length is 1000 bytes`等这类问题；请根据本地数据库版本进行对应修改；

</Alert>

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

在开发环境下，建议使用docker来创建数据库：
```
docker run --name mysql -p3306:3306 -d -e MARIADB_ROOT_PASSWORD=123456 mariadb:latest
```
然后可以使用账号root/密码123456来访问本地的数据库:
```
mysql -h 127.0.0.1 -p123456 -e 'create database dbname default charset utf8'
```

<Alert type="info">
创建的数据库默认字符集需要是utf8。

</Alert>



## 数据初始化<Badge>go-admin</Badge>

项目中支持使用命令方式初始化基本数据结构和基础数据。 可以方便的使用 `migrate` 命令进行项目数据库结构和数据初始化。如下操作：

```bash
# 初始化
# macOS or linux 下使用
$ go run main.go migrate -c config/settings.dev.yml

# windows 下使用
$ go run main.go  migrate -c config\settings.dev.yml
```

<Alert type="info">
可以通过 -c 参数实现本地多环境配置文件隔离 例如 开发环境命名为：settings.dev.yml
<br />
注意：1.2.0 之前版本需要将`migrate` 替换成 `init` 命令进行项目数据库结构和数据初始化。

</Alert>

## 启动服务<Badge>go-admin</Badge>

初始化完成之后，我们就已经迫不及待启动项目了，我们尝试一下 `./go-admin server`

```bash
# 启动服务
# macOS or linux 下使用
$ go run main.go  server -c config/settings.dev.yml

# windows 下使用
$ go run main.go  server -c config\settings.dev.yml
```

如果看到一下数据内容，请检查一下数据库配置；

```bash
2020-07-31 16:09:41.989 [INFO] Logger init success!
2020-07-31 16:09:41.990 [INFO] mysql-drive.go:20: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
2020-07-31 16:09:44.350 [FATA] mysql-drive.go:23: mysql connect error : dial tcp 127.0.0.1:3306: connect: connection refused
```

输出内容为下图，恭喜你！你已经成功了！

![](https://raw.githubusercontent.com/wenjianzhang/image/master/img/serversuccessv1.1.0.png)

go，下一步启动前端项目！

<Alert type="warning">
这里接下来是第二两个阶段了；

</Alert>

## 验证环境<Badge>go-admin-ui</Badge>

vue 项目支持的 node 和 npm 版本信息

```bash
$ node -v
v14.16.0

$ npm -v
6.14.11
```

[如需安装 node 或者 npm 进入](/guide/vue-install)

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

$ npm install  # npm install --registry=https://registry.npm.taobao.org   # 国内请使用

# 或者使用
$ cnpm install
```

<Alert type="info">
这里还原包是需要一些时间的请耐心等待一下...

</Alert>

看到类似下面输出内容说明已经安装好了

```bash
Binary found at /Users/zhangwenjian/Code/go-test/go-admin-ui/node_modules/node-sass/vendor/darwin-x64-64/binding.node
Testing binary
Binary is fine
added 2033 packages from 1953 contributors in 40.229s
```

## view 启动<Badge>go-admin-ui</Badge>

启动项目，使用`npm run dev`命令就好了。

```bash
# 启动页面
$ npm run dev
```

输出内容：

```bash
 DONE  Compiled successfully in 22188ms                                                                                                         12:47:40 AM


  App running at:
  - Local:   http://localhost:9527/
  - Network: http://192.168.3.12:9527/

  Note that the development build is not optimized.
  To create a production build, run npm run build.
```

<Alert type="info">
此时项目已经启动了，但是有一点请注意：检查 go-admin 是否也启动了。否则页面会提示错误的哦。

</Alert>

## 构建及部署

构建开始，执行 `npm run build:prod`

```bash
# 编译项目
$ npm run build:prod

  Images and other types of assets omitted.

 DONE  Build complete. The dist directory is ready to be deployed.
 INFO  Check out deployment instructions at https://cli.vuejs.org/guide/deployment.html
```

构建产物默认生成到 ./dist 下，然后通过 tree 命令查看，(windows 用户可忽略此步）

测试环境验证，将 `./dist` 文件上传到测试环境中进行验证。

部署，将测试后的 `./dist` 文件上传到最终环境或者生产环境。

<Alert type="warning">
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

</Alert>
