---
nav: 开发
group:
  title: 代码生成
  order: 4
title: 修改配置
order: 1
toc: content
---


## 修改配置

现在，打开 `config/settings.yml` 。这是个包含了 `go-admin` 项目的配置信息。

```bash
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

修改数据库配置信息；
代码生成配置；

1. gen > dbname 此配置可以根据数据库名称来获取该数据库下所有 table，进行代码生成；
2. gen > frontpath 代码生成是使用前端代码存放位置，需要指定到 src 文件夹，相对路径;代码要求 go-admin 和 go-admin-ui 必须在同一级目录下

当前我们先通过 sql 脚本的方式来创建数据库表信息。[表结构定义需要查看](/guide/db.html)

```sql
CREATE TABLE `article` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编码',
  `title` varchar(128) DEFAULT NULL COMMENT '标题',
  `author` varchar(128) DEFAULT NULL COMMENT '作者',
  `content` varchar(255) DEFAULT NULL COMMENT '内容',
	`status` int(1) DEFAULT NULL COMMENT '状态',
	`publish_at` timestamp NULL DEFAULT NULL COMMENT '发布时间',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `create_by` int(11) unsigned DEFAULT NULL,
  `update_by` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_article_deleted_at` (`deleted_at`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='文章';
```

数据库表创建以后，启动项目

```bash
go run main.go server -c config/settings.dev.yml
```