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

### 如何配置

下边我们讲解在日常项目开发使用过程中的一个多业务分库的场景，配置如下：

```yml
  databases:
    'localhost:8888':
      # 数据库类型 mysql，sqlite3， postgres
      driver: mysql
      # 数据库连接sqlite3数据文件的路径
      source: root:Qq123123@tcp(192.168.50.248:3306)/go-admin1?charset=utf8mb4&parseTime=True&loc=Local&timeout=10000ms
    'localhost:9999':
      # 数据库类型 mysql，sqlite3， postgres
      driver: mysql
      # 数据库连接sqlite3数据文件的路径
      source: root:Qq123123@tcp(192.168.50.248:3306)/go-admin2?charset=utf8mb4&parseTime=True&loc=Local&timeout=10000ms
    '*':
      # 数据库类型 mysql，sqlite3， postgres
      driver: mysql
      # 数据库连接sqlite3数据文件的路径
      source: root:Qq123123@tcp(192.168.50.248:3306)/go-admin?charset=utf8mb4&parseTime=True&loc=Local&timeout=10000ms

```

配置中`*`对应的是默认数据库，系统中基础信息需要用到`*`这个key；

其他的 `localhost:8888 , localhost:9999` 对应前端调用接口的域名，例如前端请求接口使用的是：http://localhost:8888/api/v1/login ，那么就会使用 `localhost:8888` 这个key对应的数据库。如果前端请求接口使用的是：http://localhost:9999/api/v1/login ，那么就会使用 `localhost:9999` 这个key对应的数据库。

### 如何使用

增加新租户的时候，只需要在配置文件中增加新的key即可，例如：

```yml
  databases:
    'localhost:8888':
      # 数据库类型 mysql，sqlite3， postgres
      driver: mysql
      # 数据库连接sqlite3数据文件的路径
      source: root:Qq123123@tcp(192.168.50.248:3306)/go-admin?charset=utf8mb4&parseTime=True&loc=Local&timeout=10000ms
    'www.xxxxxx.com':
      # 数据库类型 mysql，sqlite3， postgres
      driver: mysql
      # 数据库连接sqlite3数据文件的路径
      source: root:Qq123123@tcp(192.168.50.248:3306)/go-admin?charset=utf8mb4&parseTime=True&loc=Local&timeout=10000ms
```

注意：`www.xxxxxx.com` 这个key对应的前端访问api的地址，如果是生产环境请填写真实域名。

### 为什么要这样设计

这样设计的目的是为了方便开发者，开发者只需要关注业务逻辑，不需要关注数据库的切换，`go-admin` 会自动根据域名切换数据库。


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




  

