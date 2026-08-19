---
nav:
  title: 高阶
  order: 4
title: 业务分库
order: 10
toc: menu
description: go-admin 业务分库与读写分离配置：基于 GORM DBResolver 通过 registers 配置多数据源，按表路由到不同数据库连接。
keywords: [gorm 读写分离, golang 业务分库, dbresolver 配置, go 多数据源]
---

## 业务分库

业务规模变大后，常见的做法是把不同业务的数据拆到不同的库中。通常这需要在代码里维护多个数据库连接，并记住每张表该走哪一个。

go-admin 基于 GORM 的 [DBResolver](https://gorm.io/docs/dbresolver.html) 实现了这件事：**分库规则写在配置文件里，按表自动路由**，业务代码照常使用 `e.Orm`，不需要感知连接的存在。

下面是一个业务分库的配置示例：

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

配置中出现了三个连接地址，各自的作用如下：

| 位置 | 作用 |
| --- | --- |
| `database.source` | 默认连接。未被分库规则匹配到的表都走这里 |
| `registers[].source` | 该分组的主库，负责写操作 |
| `registers[].replicas` | 该分组的从库，负责读操作 |
| `registers[].tables` | 适用该分组的表名列表 |

`tables` 是路由的依据：列在其中的表（示例里是 `tb_order` 与 `tb_user`）会自动使用该分组的连接，其余表继续走默认连接。业务代码无需改动。

:::warning
当前实现下，分库分组中的 `replicas` 仅用于读操作。**针对分库的增、删、改暂不支持**，写操作仍会落到主库。

规划分库方案时需要考虑这一点：适合读多写少、可以做读写分离的表，不适合需要在独立库上完成写入的场景。

:::
