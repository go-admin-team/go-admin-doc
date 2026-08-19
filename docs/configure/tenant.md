---
nav:
  title: 高阶
  order: 4
title: 多租户
order: 10
toc: menu
description: go-admin 多租户配置教程：通过 databases 按域名区分数据库实例，配合 Nginx 转发实现一套代码服务多个租户，含配置示例与注意事项。
keywords: [go-admin 多租户, golang 多租户实现, saas 多租户数据库, 按域名分库]
---

## 多租户

多个企业或组织使用同一套系统，各自的数据与组织结构相互隔离，这类场景需要多租户支持。

go-admin 自 1.x 起内置了多租户能力，开源版即可使用，**不需要二次开发，只需增加配置**。

### 实现方式

go-admin 采用的是**按域名区分数据库**的方案：

```
dev.a.com ──┐
            ├─► 同一套前后端服务 ──► 按请求域名选择对应的数据库
dev.b.com ──┘
```

前后端都只部署一套，请求到达后端时根据 `Host` 匹配 `databases` 配置中的对应项，选用该租户的数据库连接。因此租户之间是**物理隔离**的——各自一个库，不共用表。

:::info
这种方案的特点是隔离彻底、迁移方便，代价是租户数量多时数据库实例也随之增多。

如果需要的是同库内按字段隔离（所有租户共用一张表，通过 `tenant_id` 区分），则需要自行改造，框架内置的是上述按库隔离的方式。

:::


### 示例 

前后端都无需部署多套, 只需要部署一套前后端环境

### **go-admin-ui 前端**

#### 1、go-admin-ui vue前端工程中找到文件 .env.development  将以下参数设置为空

```vue
    VUE_APP_BASE_API = ''
```

#### 2、如果应用需要上生产
```js
    npm run build:prod
```
##### 将生成的dist文件放到nginx的服务器上

#### 3、设置nginx的conf文件

- 如果是开发或测试环境, 可以直接将前端地址配置为ip+端口
```nginx
server {
  server_name dev.xxx.com;
  location / {
	 proxy_pass   http://127.0.0.1:9527;
  }
}
```

- 如果是生产环境, 直接映射dist文件
```nginx
server {
  server_name dev.xxx.com;
  location / {
	 index index.html index.html;
	 root /data/dist;
	 try_files $uri $uri/ /index.html;

  }
}
```

### **go-admin 后端**
#### 1、后端工程中找到文件 xxx.yml  将databases进行以下设置
```go
  databases:
    'dev.a.com':
      driver: mysql
      source: root:xxx@tcp(127.0.0.1:3306)/goAdmin?charset=utf8&parseTime=True&loc=Local&timeout=2000ms
    'dev.b.com':
      driver: mysql
      source: root:xxx@tcp(127.0.0.1:3306)/goAdmin?charset=utf8&parseTime=True&loc=Local&timeout=2000ms
```
#### 2、设置nginx的conf文件
```nginx
server{
  server_name dev.a.com;
  location /api/v1{
	  proxy_pass http://127.0.0.1:8000;
	  proxy_set_header Accept $http_host;
	  proxy_set_header Host $host;
	  proxy_set_header X-Real-IP $remote_addr;
	  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header HTTP_X_FORWARDED_FOR $remote_addr;
  }
}

server{
  server_name dev.b.com;
  location /api/v1{
	  proxy_pass http://127.0.0.1:8000;
	  proxy_set_header Accept $http_host;
	  proxy_set_header Host $host;
	  proxy_set_header X-Real-IP $remote_addr;
	  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header HTTP_X_FORWARDED_FOR $remote_addr;
  }
}

```


### 常见问题

配置文件已经配置但是还是访问默认数据库；

解决方案：参考一下配置：
```conf
location /api {
  proxy_pass http://web:8080/api;
  proxy_set_header Accept $http_host;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header HTTP_X_FORWARDED_FOR $remote_addr;
}
```




  

