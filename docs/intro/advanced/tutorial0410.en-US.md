---
nav:
  title: Development
  order: 2
  second:
    title: Advanced
    order: 1
group:
  title: Code Generation
  order: 6
title: Pre-Generation Setup
order: 1
toc: content
description: Preparing to generate go-admin code — table conventions, and setting the database and frontend path under the gen section of the config file.
keywords: [go-admin code generation config, gen config, code generation prerequisites]
---


## The Code Generation Flow

Going from a database table to a working page takes six steps:

| Step | What to do | Why |
| --- | --- | --- |
| 1. Pre-Generation Setup | Set the `gen` database name and frontend path | Tells the generator which database to read and where to write code |
| 2. [Generating Business Code](/en-US/intro/advanced/tutorial0420) | Pick a table, configure field attributes, generate frontend and backend code | Produces the CRUD code |
| 3. [One-Click Menu Generation](/en-US/intro/advanced/tutorial0430) | Create the corresponding menu entry | The generated page needs an entry point to be reachable |
| 4. [Binding APIs to the Menu](/en-US/intro/advanced/tutorial0440) | Register the new APIs in API management | The permission system authorizes per API |
| 5. [Configuring Role Permissions](/en-US/intro/advanced/tutorial0450) | Assign the menu and API permissions to a role | Otherwise the menu won't show after login and the APIs won't work |
| 6. [Verifying the Feature](/en-US/intro/advanced/tutorial0460) | Confirm CRUD and permissions both work | Confirms the whole chain is wired up |

:::info
The last four steps exist because of the permission system. Both menus and
APIs in go-admin are under RBAC, and **generated code doesn't authorize
itself** — this is why people often finish generating and then find "the page
won't open" or "the API says no permission".

:::

Before generating, confirm the table matches the
[Database Table Conventions](/en-US/intro/advanced/db), especially the
`created_at`, `updated_at` and `deleted_at` shared columns.

## Editing the Config

Open `config/settings.yml`; the `gen` section controls the generator's
behaviour.

```bash
  database:
    # database type: mysql, sqlite3, postgres
    driver: mysql
    # connection string; the mysql default shown here includes charset=utf8&parseTime=True&loc=Local&timeout=1000ms
    source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
  gen:
    # the database name the generator reads
    dbname: dbname
    # where generated frontend code goes, must point to the src folder, as a relative path
    frontpath: ../go-admin-ui/src
```

Set the database connection info, then the generator config:

1. `gen > dbname` — reads every table under this database name for generation;
2. `gen > frontpath` — where generated frontend code lands, must point to the `src` folder as a relative path; this requires `go-admin` and `go-admin-ui` to be sibling directories.

We'll start by creating the table with a SQL script. See the
[table structure conventions](/en-US/intro/advanced/db) first.

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

Once the table exists, start the project:

```bash
go run main.go server -c config/settings.yml
```
