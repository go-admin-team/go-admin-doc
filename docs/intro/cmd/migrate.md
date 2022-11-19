---
nav:
  title: 指令
  order: 3
title: migrate
order: 10
toc: content
---

## 视频教程

[【go-admin-pro】如何优雅的数据迁移？migrate 指令](https://www.bilibili.com/video/BV13Y4y1A7n2?spm_id_from=333.999.0.0)

[【go-admin-pro】数据迁移 migrate 指令常见的问题说明](https://www.bilibili.com/video/BV1wS4y1x7g2?spm_id_from=333.999.0.0)

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

1. 生成迁移文件

首先执行，

```sh
$ ./go-admin migrate  -a true -g true
generate migration file
```

完成后，我们打开`cmd/migrate/migration/version`目录，这时里边已经为您新添加了一个迁移文件`1654233005297_migrate.go`（一般会在最下边），我们打开看一下：

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
    migration.Migrate.SetVersion(migration.GetFilename(fileName), _1654233005297Test)
}

func _1654233005297Test(db *gorm.DB, version string) error {
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

1. 接下来只要按照文件里边的代码提示编写即可。

   ```go
   package version

   import (
   	"go-admin/cmd/migrate/migration/models"
   	"gorm.io/gorm"
   	"runtime"

   	"go-admin/cmd/migrate/migration"
   	common "go-admin/common/models"
   )

   func init() {
   	_, fileName, _, _ := runtime.Caller(0)
   	migration.Migrate.SetVersion(migration.GetFilename(fileName), _1654233005297Test)
   }

   func _1654233005297Test(db *gorm.DB, version string) error {
   	return db.Transaction(func(tx *gorm.DB) error {

   		// TODO: 这里开始写入要迁移的表构型
   		err := tx.Debug().Migrator().AutoMigrate(
   			new(models.TbDemoTest1654233005297),
   		)
   		if err != nil {
   			return err
   		}

   		return tx.Create(&common.Migration{
   			Version: version,
   		}).Error
   	})
   }

   // TbDemoTest表模型 建议带上版本号和生成文件名前缀一致
   type TbDemoTest1654233005297 struct {
   	models.Model
   	Name string `json:"name" gorm:"type:varchar(128);comment:名称"`
   	models.ModelTime
   	models.ControlBy
   }

   func (TbDemoTest1654233005297) TableName() string {
   	return "tb_demo_test" # 指定表名
   }
   ```

​ 上边我们给出了一个简单的`struct`，包含的有`Model`、`ModelTime`、`ControlBy`和`Name`属性；
其中`Model`、`ModelTime`、`ControlBy`是 `go-admin` 默认需要添加的基本属性，`Name`是业务属性；
另外还需要定义一个`TableName()`的`func`用来设置我们的表名称；

3. 执行迁移。

:::warning
温馨提醒，请认真阅读
数据库操作建议做好检查确认脚本，另外确认完成 <code>cmd/migrate/migration/version</code> 目录中只有新建的文件没有被执行过(已迁移过的文件，不会再次迁移)，因为执行迁移指令的过程中，系统会检查没有执行过的迁移脚本（sys_migration 表中 version 字段里值和 <code>cmd/migrate/migration/version</code> 目录中的文件对比），将未执行的脚本全部执行；**迁移前做好数据备份**
:::

```shell
 # 方式一：不编译运行（推荐）
 $ go run main.go migrate

1. 执行迁移
 # 方式二：编译并运行迁移 注意：不带 -c config/settings.dev.yml 默认使用 -c config/settings.yml 配置文件
 $ go build
 $ ./go-admin migrate -c config/settings.dev.yml      # mac /linux执行命令
 $ ./go-admin.exe migrate -c config/settings.dev.yml  # windows执行命令

 # 注意：sqlite 需要加 -tags=sqlite3.json1参数
 $ go run -tags=sqlite3,json1 main.go migrate

```

---

执行成功后检查数据库的对应信息，和预期一样就迁移成功，会生成`tb_demo_test`表。

## 更新模型

我们以修改字段名称为例：

1. 生成迁移文件

首先执行，

```sh
$ ./go-admin migrate  -a true -g true
generate migration file

```

完成后，我们打开`cmd/migrate/migration/version`目录，这时里边已经为您新添加了一个迁移文件`1660151543503_migrate`（一般会在最下边），我们打开看一下：

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
       migration.Migrate.SetVersion(migration.GetFilename(fileName), _1660151543503Test)
   }

   func _1660151543503Test(db *gorm.DB, version string) error {
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
   接下来只要要按照文件里边的提示修改代码即可。

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
       migration.Migrate.SetVersion(migration.GetFilename(fileName), _1660151543503Test)
   }

   func _1660151543503Test(db *gorm.DB, version string) error {
       return db.Transaction(func(tx *gorm.DB) error {
            // TODO: 例如 修改表字段 第二个参数标明需要修改的字段名
          err := tx.Migrator().AddColumn(&TbDemoTest1660151543503{}, "Desc")
               if err != nil {
                   return err
          }

          return tx.Create(&common.Migration{
              Version: version,
          }).Error
      })
     }

     // TbDemoTest表模型 这里建议带上版本号和生成文件名前缀一致
     type TbDemoTest1660151543503 struct {
         models.Model
         Name string `json:"name" gorm:"type:varchar(128);comment:名称"`
         Desc string `json:"desc" gorm:"type:varchar(255);comment:描述"` //需要添加的字段
         models.ModelTime
         models.ControlBy
     }

     func (TbDemoTest1660151543503) TableName() string {
             return "tb_demo_test" # 指定表名
     }
   ```

2. 执行迁移

   <Alert type="warning">
           <b>温馨提醒，请认真阅读</b><br />
           数据库操作建议做好检查确认脚本，另外确认完成 <code>cmd/migrate/migration/version</code> 目录中只有新建的文件没有被执行过(已迁移过的文件，不会再次迁移)，因为执行迁移指令的过程中，系统会检查没有执行过的迁移脚本（sys_migration表中version字段里值和 <code>cmd/migrate/migration/version</code> 目录中的文件对比），将未执行的脚本全部执行；**迁移前做好数据备份**
   </Alert>

3. 执行迁移

   ```shell
    # 方式一：不编译运行（推荐）
    $ go run main.go migrate

    # 方式二：编译并运行迁移 注意：不带 -c config/settings.dev.yml 默认使用 -c config/settings.yml 配置文件
    $ go build
    $ ./go-admin migrate -c config/settings.dev.yml      # mac /linux执行命令
    $ ./go-admin.exe migrate -c config/settings.dev.yml  # windows执行命令

    注意：sqlite 需要加 -tags=sqlite3.json1参数
    $ go run -tags=sqlite3,json1 main.go migrate
   ```

   ***

​ 执行成功后检查数据库的对应信息，和预期一样就迁移成功了,`tb_demo_test`会添加上`desc`字段。
