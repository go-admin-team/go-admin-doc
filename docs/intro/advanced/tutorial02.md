---
nav: 开发
group:
  title: 服务端基础
  order: 0
title: 配置文件
order: 2
toc: content
---


## 配置文件说明

如果这是你第一次使用 go-admin 的话，你需要一些初始化设置。也就是说，你需要配置一个 go-admin 即一个项目实例需要的设置数据库或者也可以使用细目本身提供的 sqlite3 的体验数据库（部分功能不支持，如代码生成），目前推荐大家使用 mysql 数据库。

进入项目工作路径，打开 `config/settings.yml` 进行配置：

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
    # 日志输出，file：文件，default：命令行，其他：命令行
    stdout: '' #控制台日志，启用后，不输出到文件
    # 日志等级, trace, debug, info, warn, error, fatal
    level: trace
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
    # 数据库连接字符串 mysql 缺省信息 charset=utf8&parseTime=True&loc=Local&timeout=5000ms
    source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=5000ms
  gen:
    # 代码生成读取的数据库名称
    dbname: dbname
    # 代码生成是使用前端代码存放位置，需要指定到src文件夹，相对路径
    frontpath: ../go-admin-ui/src
```

配置中，我们需要修改 `database` 下边的属性信息：

`user:password@tcp(127.0.0.1:3306)/dbname`

- dbname 数据库名称
- password 数据库密码
- user 数据库用户名

还需修改 `application` 下边的属性信息：

- logpath 日志文件路径，这里配置相对程序路径

:::warning

你得避免使用 go 或 go-admin 的内部保留字来命名你的项目模块以等名称。避免产生组件冲突。

:::

