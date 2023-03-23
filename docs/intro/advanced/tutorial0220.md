---
nav: 开发
group:
  title: 前端基础
  order: 0
title: 配置文件
order: 2
toc: content
---


## 配置文件说明

development 模式下，配置文件为 `.env.development`，production 模式下，配置文件为 `.env.production`。两个配置文件的配置项都是一样的，只是配置的值不一样。

### 配置项说明

```bash
# just a flag
ENV = 'development'

# base api
VUE_APP_BASE_API = 'http://localhost:8000'
```

ENV 是环境变量，如果你的环境是开发环境，那么这个值就是 development，如果是生产环境，那么这个值就是 production。

VUE_APP_BASE_API 是后端服务的地址，如果你的后端服务不是运行在本机，那么需要修改这个配置项。

### 开发环境配置文件修改

如果你的后端服务是运行在本机，那么需要修改配置文件，修改配置文件的方法如下：

```bash
# just a flag
ENV = 'development'

# base api
VUE_APP_BASE_API = 'http://localhost:8000' # 修改这个配置项
```

如果你的后端服务是运行在其它机器上，那么需要修改配置文件，修改配置文件的方法如下：

```bash
# just a flag
ENV = 'development'

# base api
VUE_APP_BASE_API = 'http://运行机器的IP:8000' # 修改这个配置项，将运行机器的IP替换成你的机器的IP
```
需要注意运行的机器对应的端口是否开放。


### 生产环境配置文件修改

在程序发布时，需要修改配置文件，修改配置文件的方法如下：

```bash
# just a flag
ENV = 'production'

# base api
VUE_APP_BASE_API = 'http://运行机器的IP:8000' # 修改这个配置项，将运行机器的IP替换成你的机器的IP或者域名
```

生产环境配置文件需要将地址改为域名或者服务器ip，如果是域名，需要将域名解析到服务器ip上。

需要注意运行的机器对应的端口是否开放。

### 常见问题

如果前端验证码打不开或者接口报错，那么需要查看环境对应的配置文件，如果是开发环境，那么需要修改 `.env.development` 文件中的 VUE_APP_BASE_API，如果是生产环境，那么需要修改 `.env.production` 文件中的 VUE_APP_BASE_API。

