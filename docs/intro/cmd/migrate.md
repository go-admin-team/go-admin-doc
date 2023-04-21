---
nav:
  title: 指令
  order: 3
title: migrate
order: 40
toc: content
---

## 视频教程

[【go-admin-pro】如何优雅的数据迁移？migrate 指令](https://www.bilibili.com/video/BV13Y4y1A7n2?spm_id_from=333.999.0.0)

[【go-admin-pro】数据迁移 migrate 指令常见的问题说明](https://www.bilibili.com/video/BV1wS4y1x7g2?spm_id_from=333.999.0.0)

## 应用场景：

1. 迁移新表
2. 变更表字段，表字段的新增、删除、修改
3. 预置表数据

## 目录说明

注意：
迁移关联数据时，如果有外键约定，需要先执行写入表数据，再执行写入关系数据，不然会报错，注意迁移时插入数据的顺序

```shell
├── migration
│         ├── init.go # 迁移类
│         ├── models #迁移模型 （go-admin系统已开发过的功能）
│         ├── version-local  # 新开发迁移文件 大家在这里开发
│         └── version #go-admin系统系统迁移文件 （已开发过的功能 不要动这里的文件，以免影响后面升级）
│                   ├── 1599190683659_tables_tables.go # 迁移表
│                   ├── 1653638869132_migrate.go # 迁移预置数据
│                   └── doc.go  # 预置数据
└── server.go # cobra.Command 命令行文件

```

## 数据迁移

在开发过程中经常会遇到数据库字段的变更和基础数据的变更，`go-admin` 提供了对应的迁移工具；

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

## 迁移步骤

1. 配置数据库配置
2. 生成迁移文件
3. 修改迁移文件
4. 创建迁移模型
5. 执行迁移命令

## 配置数据库

修改配置文件里数据库链接信息(`database`)

`config/settings.dev.yml`

## 常用命令示例

```shell
go run main.go migrate -h # 帮助
go run main.go migrate -g true -a true  -c config/settings.dev.yml # 生成 go-admin系统预置 迁移文件
go run main.go migrate -g true -c config/settings.dev.yml  # 生成 自定义功能 迁移文件 自己开发新功能用这个功能
go run main.go migrate -c config/settings.dev.yml # 执行迁移命令 迁移 未迁移过的 文件
```

参数说明：

```shell
-h # 帮助
-c # 指定配置文件 默认使用 -c config/settings.yml 配置文件
-a # 生成 系统预置 迁移文 生成到` cmd/migrate/migration/version ` go-admin系统迁移文件在这目录里操作，最好不要动，方便同步升级
-g # 生成迁移文 生成到` cmd/migrate/migration/version-local `  自己开发新功能的迁移文件在这目录里操作

```

## 新建模型实例

1. 生成迁移文件

首先执行，

```sh
$ go run main.go migrate  -a true -g true
generate migration file
```

完成后，我们打开`cmd/migrate/migration/version`目录，这时里边已经为您新添加了一个迁移文件`1654233005297_migrate.go`（一般会在最下边）：

提示：
迁移文件名版本号不要修改，后面的名称可以随便修改为有语意的名称，方便后续维护迁移文件。
例 `1654233005297_migrate.go` 修改为 `1654233005297_CreateTable_TbDemoTest.go` ,见名知意，创建`tb_demo_test`表

打开文件，我们打开看一下

```shell
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

2. 接下来只要按照文件里边的代码提示编写即可。

```shell
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
      //如果错误就报错，停止迁移
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

上边我们给出了一个简单的`struct`，包含的有`Model`、`ModelTime`、`ControlBy`和`Name`属性；
其中`Model`、`ModelTime`、`ControlBy`是 `go-admin` 默认需要添加的基本属性，`Name`是业务属性；
另外还需要定义一个`TableName()`的`func`用来设置我们的表名称；

3. 执行迁移。

:::warning
温馨提醒，请认真阅读
数据库操作建议做好检查确认脚本，另外确认完成 <code>cmd/migrate/migration/version</code> 目录中只有新建的文件没有被执行过(已迁移过的文件，不会再次迁移)，
因为执行迁移指令的过程中，系统会检查没有执行过的迁移脚本（sys_migration 表中 version 字段里值和 <code>cmd/migrate/migration/version</code> 目录中的文件对比），
将未执行的脚本全部执行；**迁移前做好数据备份**

当然，相反如果迁移过的文件，想要再次迁移，也可删除 sys_migration 表中对应版本信息的那条记录，即可以再次执行迁移文件（调适时可以试试，呵呵）。
:::

### 3.1 方式一：不编译运行（推荐）

**注意：**
不带 `-c config/settings.dev.yml` 默认使用 `-c config/settings.yml`配置文件

```shell
 # 执行迁移
 $ go run main.go migrate -c config/settings.dev.yml
```

### 3.2 方式二：编译并运行迁移

```shell
 # 不推荐，每次修改迁移文件后，都需要 go build 重新编译，容易忘记编译，掉进坑里，嘿嘿。。。
 $ go build
 $ ./go-admin migrate -c config/settings.dev.yml      # mac /linux执行命令
 $ ./go-admin.exe migrate -c config/settings.dev.yml  # windows执行命令

 # 注意：sqlite 需要加 -tags=sqlite3.json1参数
 $ go run -tags=sqlite3,json1 main.go migrate

```

### 3.3 方式三：`golangIDE` 运行

`golangIDE` 还要可以进行 debug 断点调适迁移文件，（**推荐**）

`migrate -c config/settings.dev.93.yml -g true -g true`

![image](http://cdn.go-admin.pro/img/1441611-20221120154026381-1228564155.png)

---

执行成功后检查数据库的对应信息，和预期一样就迁移成功，会生成`tb_demo_test`表。

## 更新模型实例

我们以修改字段名称为例：

1. 生成迁移文件

首先执行，

```shell
$ go run main.go migrate -c config/settings.dev.yml

注意：sqlite 需要加 -tags=sqlite3.json1参数
$ go run -tags=sqlite3,json1 main.go migrate -c config/settings.dev.yml
```

完成后，我们打开`cmd/migrate/migration/version`目录，这时里边已经为您新添加了一个迁移文件`1660151543503_migrate`（一般会在最下边），我们打开看一下：

例 `1660151543503_migrate.go` 修改为 `1660151543503_editeColumns_TbDemoTest.go` ,见名知意，修改表`tb_demo_test`字段

```shell
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

2. 修改迁移脚本
   接下来只要按照文件里边的提示修改代码即可。
   修改表字段更多操作参考`gorm`官网
   https://gorm.io/zh_CN/docs/models.html

```shell
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
    //  修改表字段 第二个参数标明需要修改的字段名 desc和mysql表里的字段名称一致
    err := tx.Migrator().AlterColumn(&TbDemoTest1660151543503{}, "name")
    if err != nil {
      return err
    }

    //  添加表字段 第二个参数标明需要修改的字段名 desc和mysql表里的字段名称一致
    err = tx.Migrator().AddColumn(&TbDemoTest1660151543503{}, "desc")
    if err != nil {
      return err
    }

    //  删除表字段 第二个参数标明需要修改的字段名 desc和mysql表里的字段名称一致
    err = tx.Migrator().DropColumn(&TbDemoTest1660151543503{}, "desc")
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

3. 执行迁移

```shell
$ go run main.go migrate -c config/settings.dev.yml

注意：sqlite 需要加 -tags=sqlite3.json1参数
$ go run -tags=sqlite3,json1 main.go migrate -c config/settings.dev.yml
```

执行成功后检查数据库的对应信息，查看`tb_demo_test`表，验证字段变化，和预期一样就迁移成功了。

## 预置表数据

思路：

按行读取`sql`语句，写入`mysql`表
`sql`语句可以先导入 mysql 表，再使用`navicat`导出插入语句

Q:为什么表里已经数据了，还要做迁移文件，写入数据？
上正式环境时，运维人员需要迁移数据。

1. 生成迁移文件

首先执行，

```sh
$ go run main.go migrate  -a true -g true
generate migration file
```

完成后，我们打开`cmd/migrate/migration/version`目录，这时里边已经为您新添加了一个迁移文件`1668407576412_migrate.go`（一般会在最下边）：

提示：
迁移文件名版本号不要修改，后面的名称可以随便修改为有语意的名称，方便后续维护迁移文件。
例 `1668407576412_migrate.go` 修改为 `1668407576412_insertSql_TbDemoTest.go` ,见名知意，`tb_demo_test`表插入数据

2. 修改迁移文件

```shell
package version

import (
  "bufio"
  "errors"
  "fmt"
  "gorm.io/gorm"
  "io"
  "log"
  "os"
  "path"
  "runtime"
  "strings"

  "go-admin/cmd/migrate/migration"
  common "go-admin/common/models"
)

func init() {
  _, fileName, _, _ := runtime.Caller(0)
  migration.Migrate.SetVersion(migration.GetFilename(fileName), _1668407576412Test)
}

// 写入数据的sql文件所在路径
const db1668407576412Path = "cmd/migrate/migration/version/1668407576412_insertSqlTbDemoTest.sql"

func _1668407576412Test(db *gorm.DB, version string) error {
  return db.Transaction(func(tx *gorm.DB) error {
    filePath := db1668407576412Path
    ext := path.Ext(filePath)
    if ext != ".sql" {
      errMsg := fmt.Sprintf("file ext is not sql. filePath：%s", filePath)
      return errors.New(errMsg)
    }

    fileContentSlice, err := ReadFileContentWithLine(filePath)
    if err != nil {
      errMsg := fmt.Sprintf("read sql file error:%s ,filePath:%s", err.Error(), filePath)
      log.Println(errMsg)
      return errors.New(errMsg)
    }

    if len(fileContentSlice) < 0 {
      errMsg := fmt.Sprintf("read sql content[%s] content is empty", filePath)
      log.Println(errMsg)
      return errors.New(errMsg)
    }
    for _, sqlStr := range fileContentSlice {
      if len(strings.TrimSpace(sqlStr)) < 1 {
        continue
      }
      res := tx.Exec(sqlStr)
      if res.Error != nil {
        fmt.Printf("insert failed, errorSql:%v\n", sqlStr)
      }
    }

    return tx.Create(&common.Migration{
      Version: version,
    }).Error
  })
}
func ReadFileContentWithLine(filePath string) (data []string, err error) {
  file, err := os.Open(filePath)
  if err != nil {
    return
  }
  defer file.Close()

  scanner := bufio.NewReader(file)
  for {
    line, _, err := scanner.ReadLine()
    if err != nil {
      if err == io.EOF {
        break
      }
    }
    if len(line) > 0 {
      data = append(data, string(line))
    }
  }

  return
}

```

3. 准备`sql`文件
   使用`navicat`等工具从表中导出需要预置的数据

导出表里所有数据
![image](http://cdn.go-admin.pro/img/1441611-20221120170153057-1042150221.png)

想导出哪张表，就勾选哪张表，选择文件保存位置 ， 下一步
![image](http://cdn.go-admin.pro/img/1441611-20221120170241522-859441028.png)

![image](http://cdn.go-admin.pro/img/1441611-20221120170403988-1084470244.png)

![image](http://cdn.go-admin.pro/img/1441611-20221120170421879-551697126.png)

开始导出
![image](http://cdn.go-admin.pro/img/1441611-20221120170438954-837439792.png)

放在 `cmd/migrate/migration/version/1668407576412_insertSqlTbDemoTest.sql` 目标下， 文件名改为和迁移文件名一致，方便管理
以供上面迁移文件读取

```sql
INSERT INTO tb_demo (`id`, `name`, `created_at`, `updated_at`, `deleted_at`, `create_by`, `update_by`) VALUES (1, '张三', '2022-11-20 16:59:41.000', '2022-11-26 16:59:47.000', '2022-11-25 16:59:50.000', 1, 1);
INSERT INTO tb_demo (`id`, `name`, `created_at`, `updated_at`, `deleted_at`, `create_by`, `update_by`) VALUES (2, '李四', '2022-11-20 16:59:41.000', '2022-11-26 16:59:47.000', '2022-11-25 16:59:50.000', 1, 1);
```

4. 执行迁移

```sh
$ go run main.go migrate -c config/settings.dev.yml

注意：sqlite 需要加 -tags=sqlite3.json1参数
$ go run -tags=sqlite3,json1 main.go migrate -c config/settings.dev.yml
```

5. 扩展：
   如果有多个 sql 文件，可以修改上面的文件，把文件路径改为数组，循环读取文件，执行数据写入。

6. 到此结束。
   感谢大家对 go-admin 的支持，希望大家多多点 star，多多推荐本项目。
