# 默认配置

## go-admin 配置

### 单点应用配置

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
    # 数据库连接字符串 mysql 缺省信息 charset=utf8&parseTime=True&loc=Local&timeout=1000ms
    source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
  gen:
    # 代码生成读取的数据库名称
    dbname: dbname
    # 代码生成是使用前端代码存放位置，需要指定到src文件夹，相对路径
    frontpath: ../go-admin-ui/src
  extend: # 扩展项使用说明
    demo:
      name: data
  cache:
    redis:
      addr: 127.0.0.1:6379
      password: xxxxxx
      db: 2
  #    memory: '' key存在即可
  queue:
    memory:
      poolSize: 100
#    redis:
#      addr: 127.0.0.1:6379
#      password: xxxxxx
#      producer:
#        streamMaxLength: 100
#        approximateMaxLength: true
#      consumer:
#        visibilityTimeout: 60
#        bufferSize: 100
#        concurrency: 10
#        blockingTimeout: 5
#        reclaimInterval: 1
```

### 多租户配置

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
  databases:
    'localhost:8000': # 这里需要⚠️ 要和请求进来的域名一致，否则会导致获取不到链接 如果经过nginx转发需要一转发地址为准
      driver: mysql
      # 数据库连接字符串 mysql 缺省信息 charset=utf8&parseTime=True&loc=Local&timeout=1000ms
      source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
  gen:
    # 代码生成读取的数据库名称
    dbname: dbname
    # 代码生成是使用前端代码存放位置，需要指定到src文件夹，相对路径
    frontpath: ../go-admin-ui/src
  extend: # 扩展项使用说明
    demo:
      name: data
  cache:
    redis:
      addr: 127.0.0.1:6379
      password: xxxxxx
      db: 2
  #    memory: '' key存在即可
  queue:
    memory:
      poolSize: 100
#    redis:
#      addr: 127.0.0.1:6379
#      password: xxxxxx
#      producer:
#        streamMaxLength: 100
#        approximateMaxLength: true
#      consumer:
#        visibilityTimeout: 60
#        bufferSize: 100
#        concurrency: 10
#        blockingTimeout: 5
#        reclaimInterval: 1
```

### application

项目的基本信息会配置在 `application` 中，包含 mode、host、name、port 等配置项；

| 配置项        | 说明                                     | 示例             |
| ------------- | ---------------------------------------- | ---------------- |
| host          | 服务器 ip 默认使用 0.0.0.0               | 默认使用 0.0.0.0 |
| mode          | dev 开发环境 test 测试环境 prod 线上环境 | dev              |
| name          | 服务名称                                 | go-admin-app     |
| port          | 服务端口号                               | 默认：8000       |
| readtimeout   | 读超时，失效                             | 当前版本失效     |
| writertimeout | 写超时 ，失效                            | 当前版本失效     |
| enabledp      | 数据权限功能开关                         | false            |

### logger

项目的日志相关的配置项，包含 path、stdout、level、enableddb；

| 配置项    | 说明                                                                                | 示例             |
| --------- | ----------------------------------------------------------------------------------- | ---------------- |
| path      | 日志存放路径                                                                        | temp/logs        |
| stdout    | 控制台日志，日志输出，file：文件，default：命令行，其他：命令行启用后，不输出到文件 | 默认使用 ''      |
| level     | 日志等级, trace, debug, info, warn, error, fatal                                    | 默认使用 0.0.0.0 |
| enableddb | 数据库日志开关                                                                      | false            |

### jwt

用户登陆认证相关的一些配置，包含 secret、timeout 等配置项；

| 配置项  | 说明                           | 示例     |
| ------- | ------------------------------ | -------- |
| secret  | token 密钥，生产环境时及的修改 | go-admin |
| timeout | token 过期时间 单位：秒        | 3600     |

### database

| 配置项 | 说明                                                                                                     | 示例                                                                                          |
| ------ | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| driver | 数据库类型 mysql，sqlite3， postgres；目前 mysql 为长期支持维护版本，sqlite 和 postgres 为 pr 提交版本； | mysql                                                                                         |
| source | 数据库连接字符串 mysql 缺省信息 charset=utf8&parseTime=True&loc=Local&timeout=1000ms                     | user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms |

### databases

试验：多租户/多数据库的一个使用

| 配置项      | 说明                                                                                                     | 示例                                                                                          |
| ----------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| map[key]    | 租户 url,根据不同的 url 自动切换不同的数据库，如果是'locaohost:8000'，则使用的对应的 drive 和 source     | 'locaohost:8000'                                                                              |
| - driver    | 数据库类型 mysql，sqlite3， postgres；目前 mysql 为长期支持维护版本，sqlite 和 postgres 为 pr 提交版本； | mysql                                                                                         |
| - source    | 数据库连接字符串 mysql 缺省信息 charset=utf8&parseTime=True&loc=Local&timeout=1000ms                     | user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms |
| - registers | 多数据源注册                                                                                             |                                                                                               |
| - - sources | 多数据源 数组                                                                                            | user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms |

### gen

| 配置项    | 说明                                                            | 示例               |
| --------- | --------------------------------------------------------------- | ------------------ |
| dbname    | 代码生成读取的数据库名称                                        | go-admin           |
| frontpath | 代码生成是使用前端代码存放位置，需要指定到 src 文件夹，相对路径 | ../go-admin-ui/src |

### extend

自定义扩展配置项

| 配置项 | 说明           | 示例                       |
| ------ | -------------- | -------------------------- |
| demo   | 示例结构体     | 这里可以根据自己的定义书写 |
| name   | 示例结构体 key | ...                        |
