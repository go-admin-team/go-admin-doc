---
nav:
  title: 高阶
  order: 4
title: 业务分库
order: 10
toc: menu
---

## 业务分库

在正常的应用开发场景中经常会遇到业务分库，通常的做法是建立多个链接区分不同的业务，在这里我们深度接入`gorm`的特性并做了友好的继承，在业务分库的应用场景中，我们只需要做对应的配置即可。完全不用再去劳心记住那个链接是做什么业务的，只需要配置好即可。

下边我们讲解在日常项目开发使用过程中的一个多业务分库的场景，配置如下：

```yml
database:
  driver: mysql
  source: root:password@tcp(************.mysql.rds.aliyuncs.com:3306)/dbname1?charset=utf8mb4&parseTime=True&loc=Local&timeout=10000ms
  registers:
    - source: root:password@tcp(************.mysql.rds.aliyuncs.com:3306)/dbname1?charset=utf8mb4&parseTime=True&loc=Local&timeout=10000ms
      replicas:
        - 'root:password@tcp(************.mysql.rds.aliyuncs.com:3306)/dbname2?charset=utf8mb4&parseTime=True&loc=Local&timeout=10000ms'
      tables:
        - 'tb_order'
        - 'tb_user'
```

配置中里边是有我们配置了三个链接地址；

1. 系统通常需要配一个默认数据库地址；
2. 第二个链接是主要数据库链接；
3. 第三个 replicas 对应的链接就是我们需要配置的分库链接，主要注意的是下边还对应的有一个 tables， tables 中需要将我们分库的表名称配置进去，这样我们程序会自动切换链接；

在使用 `tb_user`和`tb_order`表时系统会自动使用 replicas 对应的地址；

目前不支持其它分业务库的增、删、改操作；
