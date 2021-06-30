# 数据库规范

这里提供的是数据库表字段规则在你创建表时使用，当按如下的规则进行字段命名、类型设置和备注时

## 特殊字段

| 字段       | 字段名称 | 字段类型  | 字段说明                                                                                 |
| ---------- | -------- | --------- | ---------------------------------------------------------------------------------------- |
| id         | 主键     | int(11)   | 记录 id 到                                                                               |
| create_by  | 创建人   | int(11)   | 记录创建人,控制数据权限是需要用到                                                        |
| update_by  | 修改人   | int(11)   | 记录修改人                                                                               |
| created_at | 创建时间 | timestamp | 记录添加时间字段,不需要手动维护                                                          |
| updated_at | 更新时间 | timestamp | 记录更新时间的字段,不需要手动维护                                                        |
| deleted_at | 删除时间 | timestamp | 记录删除时间的字段,不需要手动维护,如果存在此字段将会生成回收站功能,字段默认值务必为 null |

## 支持的 DB

### mysql

```yml
driver: mysql
source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
```

### sqlite3 【TODO】

```yml
driver: sqlite3
source: sqlite3.db
```

### postgres 【TODO】

```yml
driver: postgres
source: host=myhost port=myport user=gorm dbname=gorm password=mypassword
```
