---
nav:
  title: 开发
  order: 2
group:
  title: 高级
  order: 2
title: actions
toc: content
---

## actions 模式

:::warning
说明
`go-admin`服务是存在两种处理模式的;

:::

    2. 复杂的业务可以使用 `常规模式`；

# 开发工具生成代码并配置角色授权操作

## 开发工具生成代码

1. 首先需要插入一个结构化的对象定义 sql

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

2. 在字段信息中选择需要进行的动作，比如需要查询操作，则勾选上复选框
3. 勾选好后提交，点击代码生成会生成相应的 go 代码和 vue 代码，同时想要看见菜单还需要点击生成配置

:::warning
说明
此处点击生成配置只需要点击一次，否则多次点击会生成多个重复菜单
:::

4.生成代码后需要重新编译前后端运行

```shell
go build .

npm run dev
```

5.编译运行便可以看见相应的菜单，但是此时还不能配置角色拥有次菜单的权限，还需要生成相应的 API 接口定义写入数据

```shell
./go-admin server -c config/settings.yml -a true
```

`-a` 的意思是指定 check api 接口，对于不存在的 api 接口会插入到数据库

6. 此时 api 接口已经插入数据库，然后我们需要给 api 菜单配置授权
   点击接口管理->找到相应的 api 接口配置标题，类型选择 BUS 表示业务类型，SYS 表示系统类型
7. 定义好接口描述后，需要在菜单管理->找到相应的菜单->点击修改->修改授权
   配置列表菜单授权查询接口，修改菜单首选修改接口，删除按钮菜单授权删除接口权限

8.此时便可以去到角色菜单，创建角色并分配新建页面的权限 9.创建用户并分配到相应的角色，即可完成对用户授权生成代码的菜单，和页面相应的角色控制
