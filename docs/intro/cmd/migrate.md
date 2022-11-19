---
nav:
  title: 指令
  order: 3
title: migrate
order: 10
toc: content
---

## 数据迁移

在开发过程中经常会遇到数据库字段的变更和基础数据的变更，`go-admin` 也提供了对应的迁移工具；

首先需要将在项目根目录下执行`go build` 将程序编译：

```sh
go build
```

执行`go-admin migrate`指令，可以进行数据迁移；

首次使用时可以使用`-h`查看帮助信息；

```sh
$ ./go-admin migrate -h

Initialize the database

Usage:
  go-admin migrate [flags]

Examples:
go-admin migrate -c config/settings.yml

Flags:
  -c, --config string   Start server with provided configuration file (default "config/settings.yml")
  -d, --domain string   select tenant host (default "*")
  -g, --generate        generate migration file
  -a, --goAdmin         generate go-admin migration file
  -h, --help            help for migrate

```

## 新建模型

1. 首先在 `cmd/migrate/migration/models` 目录中添加新的 model 文件，并做好相应的属性；

```go
package models

type TbDemo struct {
    Model
    Name string `json:"name" gorm:"type:varchar(128);comment:名称"`
    ModelTime
    ControlBy
}

func (TbDemo) TableName() string {
    return "tb_demo"
}
```

上边我们给出了一个简单的`struct`，包含的有`Model`、`ModelTime`、`ControlBy`和`Name`属性；
其中`Model`、`ModelTime`、`ControlBy`是 go-admin 默认需要添加的基本属性，`Name`是业务属性；
另外还需要定义一个`TableName()`的`func`用来设置我们的表名称；

1. 生成迁移文件

首先执行，

```sh
$ ./go-admin migrate  -a true -g true
generate migration file

```

完成后，我们打开`cmd/migrate/migration/version`目录，这时里边已经为您新添加了一个迁移文件（一般会在最下边），我们打开看一下：

```go
package version

import (
    "gorm.io/gorm"
    "runtime"

    "go-admin/cmd/migrate/migration"
    common "go-admin/common/models"
)

func init() {
    _, fileName, _, _ := runtime.Caller(0)
    migration.Migrate.SetVersion(migration.GetFilename(fileName), _1654233005296Test)
}

func _1654233005296Test(db *gorm.DB, version string) error {
    return db.Transaction(func(tx *gorm.DB) error {

        // TODO: 这里开始写入要变更的内容

        // TODO: 例如 修改表字段 使用过程中请删除此段代码
        //err := tx.Migrator().RenameColumn(&models.SysConfig{}, "config_id", "id")
        //if err != nil {
        // 	return err
        //}

        // TODO: 例如 新增表结构 使用过程中请删除此段代码
        //err = tx.Migrator().AutoMigrate(
        //		new(models.CasbinRule),
        // 		)
        //if err != nil {
        // 	return err
        //}


        return tx.Create(&common.Migration{
            Version: version,
        }).Error
    })
}

```

接下来只要要按照文件里边的放开注释代码即可。

```go
// TODO: 例如 新增表结构 使用过程中请删除此段代码
err = tx.Migrator().AutoMigrate(
        new(models.TbDemo),
        )
if err != nil {
    return err
}
```

1. 执行迁移

:::warning
温馨提醒，请认真阅读
数据库操作建议做好检查确认脚本，另外确认完成 `cmd/migrate/migration/version` 目录中是否只有新建的文件没有被执行过，因为执行迁移指令的过程中，系统会检查没有执行过的迁移脚本，将为执行的脚本全部执行；
:::

```sh
# 注意：默认使用config/settings.yml配置文件
$ ./go-admin migrate

# 或者 可以指定配置文件
$ ./go-admin migrate -c config/settings.dev.yml

```

执行成功后检查数据库的对应信息，和预期一样就迁移成功了。

## 更新模型

我们以修改字段名称为例：

1. 生成迁移文件

首先执行，

```sh
$ ./go-admin migrate  -a true -g true
generate migration file

```

完成后，我们打开`cmd/migrate/migration/version`目录，这时里边已经为您新添加了一个迁移文件（一般会在最下边），我们打开看一下：

```go
package version

import (
    "gorm.io/gorm"
    "runtime"

    "go-admin/cmd/migrate/migration"
    common "go-admin/common/models"
)

func init() {
    _, fileName, _, _ := runtime.Caller(0)
    migration.Migrate.SetVersion(migration.GetFilename(fileName), _1654233005296Test)
}

func _1654233005296Test(db *gorm.DB, version string) error {
    return db.Transaction(func(tx *gorm.DB) error {

        // TODO: 这里开始写入要变更的内容

        // TODO: 例如 修改表字段 使用过程中请删除此段代码
        //err := tx.Migrator().RenameColumn(&models.SysConfig{}, "config_id", "id")
        //if err != nil {
        // 	return err
        //}

        // TODO: 例如 新增表结构 使用过程中请删除此段代码
        //err = tx.Migrator().AutoMigrate(
        //		new(models.CasbinRule),
        // 		)
        //if err != nil {
        // 	return err
        //}


        return tx.Create(&common.Migration{
            Version: version,
        }).Error
    })
}

```

1. 修改迁移脚本
   接下来只要要按照文件里边的放开注释代码即可。

```go
// TODO: 例如 新增表结构 使用过程中请删除此段代码
err := tx.Migrator().RenameColumn(&models.TbDemo{}, "name", "name_new")
if err != nil {
    return err
}
```

1. 执行迁移

:::warning
温馨提醒，请认真阅读
数据库操作建议做好检查确认脚本，另外确认完成`cmd/migrate/migration/version`目录中是否只有新建的文件没有被执行过，因为执行迁移指令的过程中，系统会检查没有执行过的迁移脚本，将为执行的脚本全部执行；
:::

```sh
# 注意：默认使用config/settings.yml配置文件
$ ./go-admin migrate

# 或者 可以指定配置文件
$ ./go-admin migrate -c config/settings.dev.yml

```

执行成功后检查数据库的对应信息，和预期一样就迁移成功了。
