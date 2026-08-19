---
nav:
  title: 开发
  order: 2
  second:
    title: 进阶
    order: 1
group:
  title: 代码生成
  order: 6
title: 生成前配置
order: 1
toc: content
description: go-admin 代码生成前的准备：建表规范、配置文件中 gen 项的数据库与前端路径设置。
keywords: [go-admin 代码生成配置, gen 配置, 代码生成前准备]
---


## 代码生成的整体流程

从一张数据库表到可用的功能页面，需要走完六步：

| 步骤 | 做什么 | 为什么需要 |
| --- | --- | --- |
| 1. 生成前配置 | 配置 `gen` 的数据库名与前端路径 | 告诉生成器读哪个库、代码写到哪里 |
| 2. [生成业务代码](/intro/advanced/tutorial0420) | 选表、配置字段属性、生成前后端代码 | 产出增删改查代码 |
| 3. [一键生成菜单](/intro/advanced/tutorial0430) | 创建对应的菜单项 | 生成的页面需要入口才能访问 |
| 4. [菜单绑定接口](/intro/advanced/tutorial0440) | 把新接口登记到接口管理 | 权限系统按接口授权 |
| 5. [配置角色权限](/intro/advanced/tutorial0450) | 给角色分配菜单与接口权限 | 否则登录后看不到菜单，接口也调不通 |
| 6. [验证功能](/intro/advanced/tutorial0460) | 确认增删改查与权限均已生效 | 确认整条链路打通 |

:::info
后四步是权限系统的要求。go-admin 的菜单与接口都受 RBAC 控制，**生成代码本身不会自动授权**——这是很多人生成完却发现"页面打不开、接口报没权限"的原因。

:::

生成前需要确认表结构符合[数据库表规范](/intro/advanced/db)，尤其是 `created_at`、`updated_at`、`deleted_at` 这几个公共字段。

## 修改配置

打开 `config/settings.yml`，其中 `gen` 一节控制代码生成器的行为。

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

当前我们先通过 sql 脚本的方式来创建数据库表信息。[表结构定义需要查看](/intro/advanced/db)

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
go run main.go server -c config/settings.yml
```