# 快速开始

## 服务

### 工作路径

:::tip
请注意 Go version >= 1.15，并且 GO111MODULE=on (Go MOdule 模式)；
:::

新建空文件夹

```shell
mkdir dirname
cd ./dirname
```

### 获取源码

```shell
git clone https://github.com/go-admin-team/go-admin.git
```

### 服务编译

```shell
cd ./go-admin
go build
```

### 配置数据源

首先找到配置文件，`config/settings.yml`， 同时也可创建开发环境配置，只需将默认配置文件 `config/settings.yml` 复制到 `config/settings.dev.yml` 就好了

<img class="no-margin" src="https://gitee.com/mydearzwj/image/raw/master/img/configv1.1.0.png"  height="500px" style="margin:0 auto;">

```yml
settings:
  application:
    # dev开发环境 test测试环境 prod线上环境
    mode: dev
    # 服务器ip，默认使用 0.0.0.0
    host: 0.0.0.0
    # 服务名称
    name: testApp
    # 端口号
    port: 8000 # 服务端口号
    readtimeout: 1
    writertimeout: 2
    # 数据权限功能开关
    enabledp: false
  logger:
    # 日志存放路径
    path: temp/logs
    # 控制台日志
    stdout: true
    # 日志等级
    level: all
    # 业务日志开关
    enabledbus: true
    # 请求日志开关
    enabledreq: false
    # 数据库日志开关 dev模式，将自动开启
    enableddb: false
  jwt:
    # token 密钥，生产环境时及的修改
    secret: go-admin
    # token 过期时间 单位：秒
    timeout: 3600
  database:
    # 数据库类型 mysql，sqlite3， postgres
    driver: mysql
    # 数据库连接字符串 mysql 缺省信息 charset=utf8&parseTime=True&loc=Local&timeout=1000ms
    source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
    # source: sqlite3.db
    # source: host=myhost port=myport user=gorm dbname=gorm password=mypassword
  gen:
    # 代码生成读取的数据库名称
    dbname: dbname
    # 代码生成是使用前端代码存放位置，需要指定到src文件夹，相对路径
    frontpath: ../go-admin-ui/src
```

> 首先，需要修改数据库信息：

```说明
database 节点下边
# 数据库类型，目前支持：mysql，sqlite3， postgres
driver: mysql
# 数据库连接字符串 mysql 缺省信息 charset=utf8&parseTime=True&loc=Local&timeout=1000ms
source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
```

### 支持的 DB

#### mysql

```yml
driver: mysql
source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
```

#### sqlite3

```yml
driver: sqlite3
source: sqlite3.db
```

#### postgres

```yml
driver: postgres
source: host=myhost port=myport user=gorm dbname=gorm password=mypassword
```

### DB 初始化

项目中支持使用命令方式初始化基本数据结构和基础数据。 可以方便的使用 `migrate` 命令进行项目数据库结构和数据初始化。如下操作：

```shell
./go-admin migrate -c=config/settings.dev.yml
```

:::tip
可以通过 -c 参数实现本地多环境配置文件隔离 例如 开发环境命名为：settings.dev.yml

注意：1.2.0 之前版本需要将`migrate` 替换成 `init` 命令进行项目数据库结构和数据初始化。
:::

### 启动

初始化完成之后，我们就可以启动项目了，在这里需要注意一点，正常大家启动项目的方式是这样的 `./go-admin` , 哦哦 系统报错了，我们尝试一下 `./go-admin`

```shell
./go-admin
```

下图是输出内容：

<img class="no-margin" src="https://gitee.com/mydearzwj/image/raw/master/img/runv1.1.0noarg.png"  height="100px" style="margin:0 auto;">

输出内容告诉我们：Error: requires at least one arg ，至少有一个参数；

你也可以使用`./go-admin -h` 来查看帮助；

上面讲完之后，我们就可以使用自己的启动语句来启动项目了，

```shell
./go-admin server -c=config/settings.dev.yml
```

如果看到一下数据内容，请检查一下数据库配置；

```shell
2020-07-31 16:09:41.989 [INFO] Logger init success!
2020-07-31 16:09:41.990 [INFO] mysql-drive.go:20: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
2020-07-31 16:09:44.350 [FATA] mysql-drive.go:23: mysql connect error : dial tcp 127.0.0.1:3306: connect: connection refused
```

输出内容为下图，恭喜你！你已经成功了！

<img class="no-margin" src="
https://gitee.com/mydearzwj/image/raw/master/img/serversuccessv1.1.0.png"  height="500px" style="margin:0 auto;">

go，下一步启动前端项目！

## 视图

### 设置视图工作路径

返回上上级目录

```shell
# 返回到 dirname 文件夹
cd ../
```

### 下载视图源码

这里我们直接`git clone`下来。

```shell
git clone https://github.com/go-admin-team/go-admin-ui.git
```

输出内容：

```shell
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

### npm install

```shell
 cd go-admin-ui/

 npm i

 # npm i   --registry=https://registry.npm.taobao.org   # 国内请使用
```

:::tip
这里还原包是需要一些时间的请耐心等待一下...
:::

看到下边的输入说明已经安装好了

```shell
Binary found at /Users/zhangwenjian/Code/go-test/go-admin-ui/node_modules/node-sass/vendor/darwin-x64-64/binding.node
Testing binary
Binary is fine
added 2033 packages from 1953 contributors in 40.229s
```

### 启动

启动项目，使用`npm run dev`命令就好了。

```shell
npm run dev
```

输出内容：

```shell
 DONE  Compiled successfully in 22188ms                                                                                                         12:47:40 AM


  App running at:
  - Local:   http://localhost:9530/
  - Network: http://192.168.3.12:9530/

  Note that the development build is not optimized.
  To create a production build, run npm run build.
```

:::tip
此时项目已经启动了，但是有一点请注意：检查 api 是否也启动了。否则页面会提示错误的哦。
:::

## 搞定

搞定，现在你可以 go-admin 之旅！
