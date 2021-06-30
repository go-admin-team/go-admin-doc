# 快速开始

## go-admin

### 环境准备

:::tip
请注意 Go version >= 1.15，并且 GO111MODULE=on (Go MOdule 模式)；
:::

#### 环境变量

[配置环境变量请进入](/guide/env.html)

#### 设置工作目录

```bash
# 工作目录
$ mkdir myproject && cd myproject
```

### clone 项目

```bash
# clone
$ git clone https://github.com/go-admin-team/go-admin.git
```

### 编译代码

```bash
# 编译
$ cd ./go-admin
$ go mod tidy
$ go build
```

:::tip windows 下 CGO 的问题
请注意 您如果是 windows 环境您或许可能会遇到 `CGO` 的问题

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

[如何解决 cgo: exec /missing-cc: exec: "/missing-cc": file does not exist](/guide/other/faq.html#_5-cgo-exec-missing-cc-exec-missing-cc-file-does-not-exist)

:::

### 配置数据源

首先找到配置文件，`config/settings.yml`， 同时也可创建开发环境配置，只需将默认配置文件 `config/settings.yml` 复制到 `config/settings.dev.yml` 即可，或者直接使用默认配置文件，直接修改`config/settings.yml`即可。

<img class="no-margin" src="https://gitee.com/mydearzwj/image/raw/master/img/configv1.1.0.png"  height="500px" style="margin:0 auto;">

```yml
database:
  # 数据库类型 mysql，sqlite3， postgres
  driver: mysql
  # 数据库连接字符串 mysql 缺省信息 charset=utf8&parseTime=True&loc=Local&timeout=1000ms
  source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
```

:::tip
Mysql 版本 8.0+ ，在此版本下最优；
其他低版本的会出现`Error 1071: Specified key was too long; max key length is 1000 bytes`等这类问题；请根据本地数据库版本进行对应修改；
:::

### 初始化

项目中支持使用命令方式初始化基本数据结构和基础数据。 可以方便的使用 `migrate` 命令进行项目数据库结构和数据初始化。如下操作：

```bash
# 初始化
# macOS or linux 下使用
$ ./go-admin migrate -c=config/settings.dev.yml

# ⚠️注意:windows 下使用
$ go-admin.exe migrate -c=config/settings.dev.yml
```

:::tip
可以通过 -c 参数实现本地多环境配置文件隔离 例如 开发环境命名为：settings.dev.yml

注意：1.2.0 之前版本需要将`migrate` 替换成 `init` 命令进行项目数据库结构和数据初始化。
:::

### 启动

初始化完成之后，我们就可以启动项目了，在这里需要注意一点，正常大家启动项目的方式是这样的 `./go-admin` , 哦哦 系统报错了，我们尝试一下 `./go-admin`

```bash
# 启动服务
# macOS or linux 下使用
$ ./go-admin

# ⚠️注意:windows 下使用
$ ./go-admin.exe
```

下图是输出内容：

<img class="no-margin" src="https://gitee.com/mydearzwj/image/raw/master/img/runv1.1.0noarg.png"  height="100px" style="margin:0 auto;">

输出内容告诉我们：Error: requires at least one arg ，至少有一个参数；

你也可以使用`./go-admin -h` 来查看帮助；

上面讲完之后，我们就可以使用自己的启动语句来启动项目了，

```bash
# 启动服务
# macOS or linux 下使用
$ ./go-admin server -c=config/settings.dev.yml

# ⚠️注意:windows 下使用
$ ./go-admin.exe server -c=config/settings.dev.yml
```

如果看到一下数据内容，请检查一下数据库配置；

```bash
2020-07-31 16:09:41.989 [INFO] Logger init success!
2020-07-31 16:09:41.990 [INFO] mysql-drive.go:20: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
2020-07-31 16:09:44.350 [FATA] mysql-drive.go:23: mysql connect error : dial tcp 127.0.0.1:3306: connect: connection refused
```

输出内容为下图，恭喜你！你已经成功了！

<img class="no-margin" src="
https://gitee.com/mydearzwj/image/raw/master/img/serversuccessv1.1.0.png"  height="500px" style="margin:0 auto;">

go，下一步启动前端项目！

## go-admin-ui

### 设置视图工作路径

返回上上级目录

```bash
# 返回到 dirname 文件夹
$ cd ../
```

### 下载视图源码

这里我们直接`git clone`下来。

```bash
# clone
$ git clone https://github.com/go-admin-team/go-admin-ui.git
```

输出内容：

```bash
$ git clone https://github.com/go-admin-team/go-admin-ui.git
Cloning into 'go-admin-ui'...
remote: Enumerating objects: 584, done.
remote: Counting objects: 100% (584/584), done.
remote: Compressing objects: 100% (436/436), done.
remote: Total 584 (delta 127), reused 524 (delta 88), pack-reused 0
Receiving objects: 100% (584/584), 580.92 KiB | 16.00 KiB/s, done.
Resolving deltas: 100% (127/127), done.
```

> 恭喜！到目前为止说明 go-admin-ui 代码已经下载完成。

### 安装 node & npm

如果本地已经安装过的可以跳过当前步骤；

[nodejs download](https://nodejs.org/zh-cn/download/)

![](https://gitee.com/mydearzwj/image/raw/master/img/nodejs.png)

根据本地系统进行版本选择 nodejs 不同版本的下载安装；

版本信息查看

```bash
$ node -v
v14.16.0

$ npm -v
6.14.11
```

正常返回版本号说明安装成功了可以进行下一步；

### npm install

```bash
$ cd go-admin-ui/

$ npm install  # npm install --registry=https://registry.npm.taobao.org   # 国内请使用

# 或者使用
$ cnpm install
```

:::tip
这里还原包是需要一些时间的请耐心等待一下...
:::

看到类似下面输出内容说明已经安装好了

```bash
Binary found at /Users/zhangwenjian/Code/go-test/go-admin-ui/node_modules/node-sass/vendor/darwin-x64-64/binding.node
Testing binary
Binary is fine
added 2033 packages from 1953 contributors in 40.229s
```

### view 启动

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

:::tip
此时项目已经启动了，但是有一点请注意：检查 api 是否也启动了。否则页面会提示错误的哦。
:::

### 部署发布

#### 构建

执行 `npm run build:prod`

```bash
# 编译项目
$ npm run build:prod

  Images and other types of assets omitted.

 DONE  Build complete. The dist directory is ready to be deployed.
 INFO  Check out deployment instructions at https://cli.vuejs.org/guide/deployment.html
```

构建产物默认生成到 ./dist 下，然后通过 tree 命令查看，(windows 用户可忽略此步）

#### 测试环境验证

将 `./dist` 文件上传到测试环境中进行验证。

#### 部署

将测试后的 `./dist` 文件上传到最终环境或者生产环境。
