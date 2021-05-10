# 环境部署

## nginx 配置

配置服务器上的配置

新建/etc/nginx/conf.d/test.haimait.com.conf

```bash
server {
  listen 80;
  server_name test.haimait.com;
  # 配置前端静态文件目录
  location / {
      index index.html index.htm;
      root /home/go/src/go-admin/dist;
     }
  # 配置后台go服务api接口服务 代理到8877端口
  location ~ ^/goadminapi/ {
      proxy_set_header   Host             $http_host;
      proxy_set_header   X-Real-IP        $remote_addr;
      proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
      proxy_set_header   X-Forwarded-Proto  $scheme;
      rewrite ^/goadminapi/(.*)$ /$1 break;
      proxy_pass  http://127.0.0.1:8877;
      }
}
```

```bash
`nginx -t` //测试nginx配置是否正确
`nginx -s reload` //重启nginx服务
```

## 打包 go 服务

#### 修改配置文件

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
    # token 密钥，【特别注意：生产环境时及的修改】
    secret: go-admin
    # token 过期时间 单位：秒
    timeout: 3600
  database:
    # 数据库类型 mysql，sqlite3， postgres
    driver: mysql
    # 数据库连接字符串 mysql 缺省信息 charset=utf8&parseTime=True&loc=Local&timeout=1000ms
    source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
  gen:
    # 代码生成读取的数据库名称
    dbname: dbname
    # 代码生成是使用前端代码存放位置，需要指定到src文件夹，相对路径
    frontpath: ../go-admin-ui/src
```

#### 修改默认端口的代码文件

#### 编写自动打包上传的 shell 脚本文件

##### 新建打包脚本 `go-admin/build-go-admin.sh`

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

##### 新建上传脚本 `/go-admin/scpToServer.sh`

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

#### 打包并上传

​
命令行里运行

```bash
cd go-admin
haima@haima-PC:/media/haima/34E401CC64DD0E28/site/go/src/haimait/learn/go-admin/dome01/go-admin$ ./build-go-admin.sh
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

<a href="https://gitee.com/mydearzwj/image/raw/master/img/bs1.gif" target="_blank">
      <img src="https://gitee.com/mydearzwj/image/raw/master/img/bs1.gif" alt="" width="100%">
</a>

#### 编写后台启动 go 服务脚本

##### 在服务器上新建 go-admin/restart.sh 文件

```bash
#!/bin/bash
echo "删除进程"
killall go-admin #杀死运行中的go-admin服务进程
echo "启动进程"
nohup ./go-admin server -c=config/settings.yml >> access.log 2>&1 & #后台启动服务将日志写入access.log文件
ps -aux | grep go-admin #查看运行用的进程
```

##### 上传 config 配置到服务器上

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

##### 启动服务

`./restart`

##### 后台启动服务

```bash
[root@iZ2ze505h9bgsbp83ct28pZ go-admin]# ./restart.sh
删除进程
go-admin: 未找到进程
启动进程
root      4033  0.0  0.0  12324  1080 pts/0    R+   07:39   0:00 grep go-admin
```

#### 查看启动的服务

下面可以看到 go-admin 的 8877 服务已经运行

```bash
[root@iZ2ze505h9bgsbp83ct28pZ go-admin]# netstat -tpln
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 127.0.0.1:6379          0.0.0.0:*               LISTEN      27650/redis-server
tcp        0      0 0.0.0.0:5355            0.0.0.0:*               LISTEN      921/systemd-resolve
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      1733/nginx: master
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1041/sshd
tcp6       0      0 :::3306                 :::*                    LISTEN      14732/mysqld
tcp6       0      0 :::8811                 :::*                    LISTEN      27758/./mindoc
tcp6       0      0 :::5355                 :::*                    LISTEN      921/systemd-resolve
tcp6       0      0 :::8877                 :::*                    LISTEN      4031/./go-admin
tcp6       0      0 :::80                   :::*                    LISTEN      1733/nginx: master
tcp6       0      0 :::8887                 :::*                    LISTEN      16252/./power
[root@iZ2ze505h9bgsbp83ct28pZ go-admin]#
```

#### 更新 go 服务

每次修改来代码后,想要更新到服务器上步骤.

##### 先删除服务器上的/home/go/src/go-admin/go-admin 二进制文件

##### 重复 3.4 和 3.5 步骤即可

### 打包前端文件并上传

### 修改配置文件

修改生产环境请求接口的配置文件

修改`go-admin/dome01/go-admin-ui/.env.production`文件里的

`VUE_APP_BASE_API = 'http://test.haimait.com/goadminapi'`

这里的域名地址和 1.2nginx 里配置的 go 后台 api 接口地址 保持一致

### 编写自动打包上传的 shell 脚本文件

##### 新建`/go-admin-ui/npmbuild.sh`

```bash
# !/bin/bash

npm run build:prod
echo "复制dist文件到服务器"
#调用scpToServer文件把本把打包好的dist文件夹上传到服务器上
expect ./scpToServer.sh $i $j
```

##### 新建`/go-admin-ui/scpToServer.sh`

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

### 执行脚本文件

执行脚本文件,打包并上传到服务器

`./npmbuild.sh`

### 登陆后台页面

http://www.zhangwj.com

已经成功部署到线上了

### 更新前端代码到服务器

重复【执行脚本文件】步骤,就会重新打包并覆盖到线上的 dist 目录文件了

<a href="https://gitee.com/mydearzwj/image/raw/master/img/bs2.gif" target="_blank">
      <img src="https://gitee.com/mydearzwj/image/raw/master/img/bs2.gif" alt="" width="100%">
</a>

:::tip
特别感谢 海马同学 的支持，对文档的维护起到了至关重要的角色
:::
