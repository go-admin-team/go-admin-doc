---
nav:
  title: Development
  order: 2
  second:
    title: Advanced
    order: 1
group:
  title: Layered Development
  order: 5
title: Database Table Conventions
toc: content
order: 7
description: go-admin database table design conventions — common fields, column naming, type choices and comment requirements, which the code generator relies on.
keywords: [database table design conventions, mysql column naming conventions, go-admin table conventions]
---

# Database Conventions

These are the field rules to follow when creating a table — naming, types and comments — matching the pattern below.

## Special Fields

| Field       | Name | Type  | Notes                                                                                 |
| ---------- | -------- | --------- | ---------------------------------------------------------------------------------------- |
| id         | primary key     | int(11)   | the record's id                                                                              |
| create_by  | created by   | int(11)   | records who created the row; needed for data-permission scoping                                                       |
| update_by  | updated by   | int(11)   | records who last updated the row                                                                              |
| created_at | created at | timestamp | records when the row was created; maintained automatically                                                          |
| updated_at | updated at | timestamp | records when the row was last updated; maintained automatically                                                        |
| deleted_at | deleted at | timestamp | records when the row was deleted; maintained automatically. If this column exists, a recycle-bin feature is generated for it — its default value must be null |

## Supported Databases

### mysql

```yml
driver: mysql
source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
```

### sqlite3

```yml
driver: sqlite3
source: sqlite3.db
```

### postgres

```yml
driver: postgres
source: host=myhost port=myport user=gorm dbname=gorm password=mypassword
```
