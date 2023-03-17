---
nav:
  title: 高阶
  order: 4
title: 多租户
order: 10
toc: menu
---

## 多租户

多个不同的企业、组织或个体使用同一套系统，但是他们有需要区分自己的数据和组织，那么这样的场景就需要使用多租户模式了；

那么问题来了 `go-admin` 中应该如何实现多租户呢？是不是需要二次开发才能够支持呢？对开发者友好吗？更或者说对新手开发者友好吗？需不需要收费呢？

以上问题的答案：

1. `go-admin` 早已替开发者考到了，`go-admin` 从1.x的开源版本就已经支持了支持多租户模式。
2. 完全不需要进行二次开发就能够支持多租户模式。
3. 只需要添加配置即可实现多租户模式。
4. 完全对所有开发者开放，不收费。


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
	 proxy_pass   http://172.16.3.3:9527;
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
      source: root:xxx@tcp(172.16.3.3:3306)/goAdmin?charset=utf8&parseTime=True&loc=Local&timeout=2000ms
    'dev.b.com':
      driver: mysql
      source: root:xxx@tcp(172.16.3.3:3306)/goAdmin?charset=utf8&parseTime=True&loc=Local&timeout=2000ms
```
#### 2、设置nginx的conf文件
```nginx
server{
  server_name dev.a.com;
  location /api/v1{
	  proxy_pass http://172.16.3.3:8000;
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
	  proxy_pass http://172.16.3.3:8000;
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




  

