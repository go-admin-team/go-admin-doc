---
nav:
  title: Development
  order: 2
  second:
    title: Advanced
    order: 1
group:
  title: Development Patterns
  order: 4
title: Actions Pattern
toc: content
order: 1
description: go-admin's Actions development pattern — using the common Actions in common/actions to handle single-table CRUD, where a module needs only a model, dto and router file.
keywords: [go-admin actions, gin generic crud, golang rapid crud development]
---

## The Actions Pattern

:::info
go-admin has two development patterns, chosen by how complex the business logic is:

1. **The Actions Pattern** (this page) — the default choice for single-table CRUD. The five common
   Actions in `common/actions` already cover parameter binding, data-permission filtering, actor
   injection, pagination and error responses, so a module needs only three files — model, dto and
   router — with no apis or service to write.
2. **[The Hand-Written Pattern](/en-US/intro/advanced/bus)** — for when business logic goes beyond
   single-table CRUD (cross-table transactions, external calls, complex validation), where you write
   the Handler and Service yourself.

A compiled, complete example lives in the repository's `app/demo/` directory — where this page and
that directory disagree, the directory is authoritative.

:::

# Generating Code with the Dev Tool and Setting Up Role Authorization

## Generating Code with the Dev Tool

1. First, insert a structured table definition as SQL:

```sql
CREATE TABLE `article` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `title` varchar(128) DEFAULT NULL COMMENT 'title',
  `author` varchar(128) DEFAULT NULL COMMENT 'author',
  `content` varchar(255) DEFAULT NULL COMMENT 'content',
	`status` int(1) DEFAULT NULL COMMENT 'status',
	`publish_at` timestamp NULL DEFAULT NULL COMMENT 'publish time',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `create_by` int(11) unsigned DEFAULT NULL,
  `update_by` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_article_deleted_at` (`deleted_at`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='article';
```

2. In the field settings, select which actions you need — check the box for query if you need a query action, and so on.
3. Once checked, submit and click "Generate Code" to produce the corresponding Go and Vue code. To also get a menu entry, click "Generate Config" as well.

:::warning
Note

Click "Generate Config" here only once — clicking it repeatedly creates duplicate menu entries.
:::

4. After generating the code, rebuild and rerun both the backend and frontend:

```shell
go build .

npm run dev
```

5. Once rebuilt, you'll see the corresponding menu — but roles can't yet be granted access to it, since the matching API definitions still need to be generated and written to the database:

```shell
./go-admin server -c config/settings.yml -a
```

`-a` tells the server to check APIs — any API endpoint that isn't already in the database gets inserted.

6. With the API endpoints now in the database, configure authorization for the API menu next.
   Go to Interface Management → find the corresponding API entry to configure its title, and for Type choose BUS for business logic or SYS for system-level.
7. After filling in the API description, go to Menu Management → find the corresponding menu → click Edit → edit its authorization.
   Assign the query endpoint to the list menu, the update endpoint to the edit menu, and the delete endpoint to the delete button's menu entry.

8. Now go to Role Management, create a role and assign it permission to the newly created page.
9. Create a user and assign it to that role, and the user is now authorized to see the menu for the generated code and the corresponding page-level role control.
