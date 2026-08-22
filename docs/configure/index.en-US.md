---
nav:
  title: Advanced
  order: 4
title: Sharding by Business
order: 10
toc: menu
description: go-admin's business sharding and read/write splitting configuration — multiple data sources set up via registers, built on GORM's DBResolver, routing table by table to different database connections.
keywords: [gorm read write splitting, golang business sharding, dbresolver configuration, go multiple data sources]
---

## Sharding by Business

As a project grows, a common approach is to split different business data across different databases. This usually means maintaining several database connections in code, and remembering which table belongs to which one.

go-admin handles this using GORM's [DBResolver](https://gorm.io/docs/dbresolver.html): **sharding rules live in the config file and route automatically by table**, while business code keeps using `e.Orm` as usual, with no need to be aware the connections exist.

Here's a sharding config example:

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

The config has three connection addresses, each with a distinct role:

| Location | Role |
| --- | --- |
| `database.source` | The default connection. Any table not matched by a sharding rule uses this |
| `registers[].source` | The primary for this group, handling writes |
| `registers[].replicas` | The replicas for this group, handling reads |
| `registers[].tables` | The list of table names this group applies to |

`tables` is what drives the routing: tables listed there (`tb_order` and `tb_user` in the example) automatically use that group's connection; everything else keeps using the default connection. No changes needed on the business-code side.

:::warning
In the current implementation, a sharding group's `replicas` are used for reads only. **Writes, deletes, and updates against a sharded group aren't supported yet** — writes still land on the primary.

Keep this in mind when designing a sharding scheme: it fits tables that are read-heavy and can tolerate read/write splitting, not ones that need writes completed on an isolated database.

:::
