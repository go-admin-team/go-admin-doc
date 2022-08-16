---
title: 环境部署
order: 50
toc: menu
---

## 一 、视频地址：

[【go-admin】如何启动go-admin](https://www.bilibili.com/video/BV1z5411x7JG?spm_id_from=333.337.search-card.all.click)

[【go-admin】多命令启动方式讲解以及IDE配置](https://www.bilibili.com/video/BV1Fg4y1q7ph?spm_id_from=333.337.search-card.all.click)

[【go-admin】go-admin的下载与启动](https://www.bilibili.com/video/BV1wT4y1L7Yc?spm_id_from=333.999.0.0)




部署后台服务：

方式一：[Shell脚本打包 go 服务](https://www.bilibili.com/video/BV1PT411P7Zx?p=2)

方式二：[Docker打包 go 服务](https://www.bilibili.com/video/BV1PT411P7Zx?p=1)



## 二、nginx 配置

**流程**

- 首先确保项目前后端在本地可以都可以正常跑起来,如果不会可以去看一下作者的视频教程
- 配置域名(go-admin.haimait.com)代理到80端口，前端vue打包的文件dist目录上传到对应的目录
- 配置域名(go-admin.haimait.com/goadminapi)代理到后端服务的8000端口，并上传后台文件启动服务

配置服务器上的配置

新建/etc/nginx/conf.d/go-admin.haimait.com.conf

```bash
server {
  listen 80;
  server_name go-admin.haimait.com;
  # 配置前端静态文件目录
  location / {
      index index.html index.htm;
      root /home/go/src/go-admin/dist;
      try_files $uri $uri/ /index.html;
     }
  # 配置后台go服务api接口服务 代理到8000端口
  location ~ ^/goadminapi/ {
      proxy_set_header   Host             $http_host;
      proxy_set_header   X-Real-IP        $remote_addr;
      proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
      proxy_set_header   X-Forwarded-Proto  $scheme;
      rewrite ^/goadminapi/(.*)$ /$1 break;
      proxy_pass  http://127.0.0.1:8000;
      }
}
```

```bash
`nginx -t` //测试nginx配置是否正确
`nginx -s reload` //重启nginx服务
```

## 三、API接口打包配置

### 3.1 方式一：Shell脚本打包 go 服务

#### 3.1.1 修改配置文件

修改`go-admin/config/settings.yml`

**这里要填写你服务器上的 mysql 数据库的配置信息**

```bash
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
    # 日志输出，file：文件，default：命令行，其他：命令行
    stdout: '' #控制台日志，启用后，不输出到文件
    # 日志等级, trace, debug, info, warn, error, fatal
    level: trace
    # 数据库日志开关
    enableddb: false
  jwt:
    # token 密钥，【特别注意：生产环境时及的修改】
    secret: go-admin
    # token 过期时间 单位：秒
    timeout: 3600
  database:
    # 数据库类型 mysql, sqlite3, postgres, sqlserver
    # sqlserver: sqlserver://用户名:密码@地址?database=数据库名
    driver: mysql
    # 数据库连接字符串 mysql 缺省信息 charset=utf8&parseTime=True&loc=Local&timeout=1000ms
    source: root:123456@tcp(127.0.0.1:3306)/go_admin_dev?charset=utf8mb4&parseTime=True&loc=Local&timeout=1000ms
  gen:
    # 代码生成读取的数据库名称
    dbname: go_admin_dev
    # 代码生成是使用前端代码存放位置，需要指定到src文件夹，相对路径
    frontpath: ../go-admin-ui/src
```

#### 3.1.2 编写打包脚本

编写自动打包上传的 shell 脚本文件

##### a. 打包脚本

新建打包脚本 `go-admin/build-go-admin.sh`

**注意**
如果是 mac 和 windows 自己百度 go 交叉编译的方法或者参考下面的地址

<a href="https://www.cnblogs.com/haima/p/12041833.html" target="_blank">Go 语言 Mac、Linux、Windows 下交叉编译</a>

```bash
# !/bin/bash

# 如果是mac使用这个打包
# CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o go-admin main.go

# 如果是windows使用这个打包 自行测试
# SET CGO_ENABLED=0
# SET GOOS=linux
# SET GOARCH=amd64
# go build -o go-admin main.go

# 如果是linux环境使用这个打包
go build -o go-admin main.go

echo "复制文件到服务器"
echo "CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build main.go"
#调用上传文件脚本把打包好的go-admin二进制文件上传到服务器上
expect ./scpToServer.sh $i $j
```

##### b. 上传脚本

新建上传脚本 `/go-admin/scpToServer.sh`

```bash
#!/usr/bin/expect -f

# 复制go-admin(和上面的build-go-admin.sh打包文件名保持一致)二进制文件到服务器/home/go/src/go-admin目录 root:服务器用户名
spawn scp go-admin root@182.92.234.123:/home/go/src/go-admin
#######################
expect {
  -re ".*es.*o.*" {
    exp_send "yes\r"
    exp_continue
  }
  -re ".*sword.*" {
    exp_send "这里是你的服务器密码\r"
  }
}
interact
```

##### c. 执行脚本

打包并上传命令行里运行

```bash
cd go-admin
haima@haima-PC:/site/go/src/haimait/learn/go-admin/dome01/go-admin$ ./build-go-admin.sh
spawn scp go-admin root@182.92.234.111:/home/go/src/go-admin
root@182.92.234.111's password:
go-admin                                                                                                                                                100%   43MB 635.7KB/s   01:09
```

去服务器上查看已经上传到服务器上了

```bash
[root@iZ2ze505h9bgsbp83ct28pZ ~]# cd /home/go/src/go-admin/
[root@iZ2ze505h9bgsbp83ct28pZ go-admin]# ll
总用量 43868
-rwxr-xr-x 1 root root 44920528 7月   7 06:53 go-admin
```

<a href="https://qiniu.haimait.top/%20blog/1441611-20200709083637333-1658657627.gif" target="_blank">
      <img src="https://qiniu.haimait.top/%20blog/1441611-20200709083637333-1658657627.gif" alt="" width="100%">
</a>

#### 3.1.3 编写启动脚本

编写后台启动 go 服务脚本

##### a. 启动脚本

在服务器上新建 go-admin/restart.sh 文件

```bash
#!/bin/bash
echo "删除进程"
killall go-admin #杀死运行中的go-admin服务进程
echo "启动进程"
nohup ./go-admin server -c=config/settings.yml >> access.log 2>&1 & #后台启动服务将日志写入access.log文件
ps -aux | grep go-admin #查看运行用的进程
```

##### b. 上传配置

上传 config 配置到服务器上

```bash
[root@iZ2ze505h9bgsbp83ct28pZ go-admin]# tree
.
├── config
│ ├── db.sql # 系统初始化配置不建议上传服务器
│ ├── rbac_model.conf
│ ├── READMEN.md
│ ├── settings.dev.yml # 测试环境配置不建议上传服务器
│ ├── settings.yml
│ └── sqlite.sql # 系统初始化配置不建议上传服务器
├── go-admin
└── restart.sh
```

##### c. 启动服务

```bash
[root@iZ2ze505h9bgsbp83ct28pZ go-admin]# ./restart.sh
删除进程
go-admin: 未找到进程
启动进程
root      4033  0.0  0.0  12324  1080 pts/0    R+   07:39   0:00 grep go-admin
```

#### 3.1.4 查看启动的服务

下面可以看到 go-admin 的 8000 服务已经运行

```bash
[root@iZ2ze505h9bgsbp83ct28pZ go-admin]# netstat -tpln
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 127.0.0.1:6379          0.0.0.0:*               LISTEN      27650/redis-server
tcp        0      0 0.0.0.0:5355            0.0.0.0:*               LISTEN      921/systemd-resolve
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      1733/nginx: master
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1041/sshd
tcp6       0      0 :::3306                 :::*                    LISTEN      14732/mysqld
tcp6       0      0 :::8877                 :::*                    LISTEN      4031/./go-admin
tcp6       0      0 :::80                   :::*                    LISTEN      1733/nginx: master
[root@iZ2ze505h9bgsbp83ct28pZ go-admin]#
```

#### 3.1.5 更新服务

每次修改代码后,想要更新到服务器上步骤.

##### a. 删除服务器上二进制文件

先删除服务器上的/home/go/src/go-admin/go-admin 二进制文件

##### b. 重复 3.1.2 和 3.1.5 步骤即可

### 3.2 方式二：Docker打包 go 服务

#### 3.2.1进入到项目根目录

`cd /go-admin`

#### 3.2.2 执行`make`命令

```shell
# 打包镜像
make build-linux 

# 重启服务
make run

# 停止服务
make stop

# 打包并启动服务
make deploy

```

#### 3.2.3 实操视频

请文档上面的视频

## 四、前端vue文件打包配置

### 4.1 方式一：Shell脚本打包VUE服务

#### 4.1.1 修改配置文件

修改生产环境请求接口的配置文件

修改`go-admin/dome01/go-admin-ui/.env.production`文件里的

`VUE_APP_BASE_API = 'http://go-admin.haimait.com/goadminapi'`

这里的域名地址和 `nginx` 里配置的 `go` 后台 `api` 接口地址 保持一致

#### 4.1.2 编写打包脚本

编写自动打包并上传文件到服务上的 shell 脚本文件

##### a. 打包脚本

新建`/go-admin-ui/npmbuild.sh`

```bash
# !/bin/bash

npm run build:prod
echo "复制dist文件到服务器"
#调用scpToServer文件把本把打包好的dist文件夹上传到服务器上
expect ./scpToServer.sh $i $j
```

##### b. 上传脚本

新建`/go-admin-ui/scpToServer.sh`

```bash
#!/usr/bin/expect -f

# 复制go-admin(和上面的build-go-admin.sh打包文件名保持一致)二进制文件到服务器/home/go/src/go-admin目录 root:服务器用户名
spawn scp -rC dist root@182.92.234.123:/home/go/src/go-admin
#######################
expect {
  -re ".*es.*o.*" {
    exp_send "yes\r"
    exp_continue
  }
  -re ".*sword.*" {
    #exp_send "这里是你的服务器密码\r"
  }
}
interact
```

#### 4.1.3 执行脚本

执行脚本文件,打包并上传到服务器

`./npmbuild.sh`

#### 4.1.4 登陆后台页面

https://www.go-admin.dev

已经成功部署到线上了

#### 4.1.5 更新前端代码到服务器

重复【执行打包脚本文件】步骤,就会重新打包并覆盖到线上的 dist 目录文件了

<a href="https://qiniu.haimait.top/%20blog/1441611-20200709081702339-66407937.gif" target="_blank">
      <img src="https://qiniu.haimait.top/%20blog/1441611-20200709081702339-66407937.gif" alt="" width="100%">
</a>



### 4.2 方式二：Docker打包 前端 服务

等待更新...





特别感谢 海马同学 的支持

<Alert type="warning">
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

</Alert>