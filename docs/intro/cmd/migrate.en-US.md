---
nav:
  title: Development
  order: 2
  second:
    title: Commands
    order: 2
title: The migrate Command
order: 40
toc: content
description: A full walkthrough of go-admin's migrate command — initializing the schema and seed data, generating migration files, writing custom migrations, and migrating data via SQL, with all three ways to run it and their flags.
keywords: [go-admin migrate, golang database migration, go database version management, gorm migration]
---

## When to Use It

1. Adding a new table
2. Changing table columns — adding, dropping, or modifying them
3. Seeding table data

## Directory Layout

Note: when migrating data with a foreign-key relationship, the referenced table's rows must be written first, then the relationship data — otherwise the migration will fail. Pay attention to insert order.

```shell
├── migration
│         ├── init.go # the migration base
│         ├── models # migration models (features go-admin already ships)
│         ├── version-local  # new migrations you develop here
│         └── version # go-admin's own migration files (already-shipped features — leave these alone so future upgrades aren't affected)
│                   ├── 1599190683659_tables_tables.go # table migration
│                   ├── 1653638869132_migrate.go # seed-data migration
│                   └── doc.go  # seed data
└── server.go # the cobra.Command CLI file

```

## Data Migration

Database schema changes and seed-data changes come up constantly during development, and go-admin ships a matching migration tool.

First, build the binary from the project root:

```sh
go build
```

Running the `go-admin migrate` command performs the migration.

The first time, `-h` shows the help text:

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

## Migration Steps

1. Configure the database connection
2. Generate a migration file
3. Edit the migration file
4. Create the model
5. Run the migration

## Configuring the Database

Edit the database connection (`database`) in the config file:

`config/settings.yml`

## Common Commands

```shell
go run main.go migrate -h # help
go run main.go migrate -g -a  -c config/settings.yml # generate a go-admin built-in migration file
go run main.go migrate -g -c config/settings.yml  # generate a migration file for your own feature
go run main.go migrate -c config/settings.yml # run any migrations that haven't been applied yet
```

Flags:

```shell
-h # help
-c # config file, defaults to -c config/settings.yml
-a # generate a built-in migration file into `cmd/migrate/migration/version` — this is where go-admin's own migrations live; best left alone so upgrades stay in sync
-g # generate a migration file into `cmd/migrate/migration/version-local` — this is where migrations for your own features live

```

## Creating a New Model

1. Generate the migration file

Run:

```sh
$ go run main.go migrate  -a -g
generate migration file
```

Once that's done, open the `cmd/migrate/migration/version` directory — a new migration file has been added for you, `1654233005297_migrate.go` (usually at the bottom of the listing).

Tip:
Don't change the version-number part of a migration filename. The rest can be renamed to something meaningful, which makes the file easier to recognize later.
For example, `1654233005297_migrate.go` renamed to `1654233005297_CreateTable_TbDemoTest.go` makes it obvious at a glance that it creates the `tb_demo_test` table.

Let's open the file and take a look:

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

    // TODO: write your changes here

    // TODO: e.g. modify a column — delete this block once you're using it
    //err := tx.Migrator().RenameColumn(&models.SysConfig{}, "config_id", "id")
    //if err != nil {
    // 	return err
    //}

    // TODO: e.g. add a new table — delete this block once you're using it
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

2. Then just fill in the code following the comments in the file.

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

    // TODO: write the table shape to migrate here
    err := tx.Debug().Migrator().AutoMigrate(
      new(models.TbDemoTest1654233005297),
    )


    if err != nil {
      // fail and stop the migration on error
      return err
    }

    return tx.Create(&common.Migration{
      Version: version,
    }).Error
  })
}

// TbDemoTest table model — recommended to keep the version number prefix matching the generated filename
type TbDemoTest1654233005297 struct {
  models.Model
  Name string `json:"name" gorm:"type:varchar(128);comment:名称"`
  models.ModelTime
  models.ControlBy
}

func (TbDemoTest1654233005297) TableName() string {
  return "tb_demo_test" # sets the table name
}
```

Above is a simple `struct` with `Model`, `ModelTime`, `ControlBy`, and a `Name` field.
`Model`, `ModelTime`, and `ControlBy` are the base fields go-admin expects by default; `Name` is the business field.
A `TableName()` function is also required, to set the table's name.

3. Run the migration.

:::warning
Please read this carefully.

For database operations, it's worth having a verification script ready, and confirming that the <code>cmd/migrate/migration/version</code> directory only contains newly added files that haven't run yet (a migration file that's already run won't run again).
That's because running the migrate command checks for migration scripts that haven't been applied yet (comparing the `version` values in the `sys_migration` table against the files in <code>cmd/migrate/migration/version</code>) and runs every one that hasn't. **Back up your data before migrating.**

On the flip side, if you want to re-run a migration file that's already been applied, you can delete the matching version row from the `sys_migration` table to make it eligible to run again (handy to try out while debugging).
:::

### 3.1 Option 1: Run Without Building (Recommended)

**Note:**
Without a `-c` flag, `config/settings.yml` is used by default.

```shell
 # run the migration
 $ go run main.go migrate -c config/settings.yml
```

### 3.2 Option 2: Build, Then Run

```shell
 # Not recommended: every time you change a migration file you have to rebuild, which is easy to forget — you end up running the old version
 $ go build
 $ ./go-admin migrate -c config/settings.yml      # macOS / Linux
 $ ./go-admin.exe migrate -c config/settings.yml  # Windows

 # Note: sqlite needs the -tags=sqlite3,json1 flag
 $ go run -tags=sqlite3,json1 main.go migrate

```

### 3.3 Option 3: Run From a Go IDE

A Go IDE also lets you set breakpoints and debug the migration file (**recommended**).

In the IDE's run configuration, set `Run kind` to `Package` or `File`, and fill the migration flags into `Program arguments`:

```
migrate -c config/settings.yml -g
```

`Working directory` needs to point at the project root, or the relative path in `-c` won't resolve.

---

Once it runs successfully, check the database — if it matches what you expected, the migration worked, and the `tb_demo_test` table now exists.

## Updating a Model

Let's walk through renaming a column as an example.

1. Generate the migration file

Run:

```shell
$ go run main.go migrate -c config/settings.yml

Note: sqlite needs the -tags=sqlite3,json1 flag
$ go run -tags=sqlite3,json1 main.go migrate -c config/settings.yml
```

Once that's done, open the `cmd/migrate/migration/version` directory — a new migration file has been added, `1660151543503_migrate` (usually at the bottom). Let's open it:

For example, rename `1660151543503_migrate.go` to `1660151543503_editeColumns_TbDemoTest.go` — it's now obvious this migration edits columns on `tb_demo_test`.

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

    // TODO: write your changes here

    // TODO: e.g. modify a column — delete this block once you're using it
    //err := tx.Migrator().RenameColumn(&models.SysConfig{}, "config_id", "id")
    //if err != nil {
    // 	return err
    //}

    // TODO: e.g. add a new table — delete this block once you're using it
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

2. Edit the migration script.
   Fill in the code following the comments in the file.
   For more column-editing operations, see the [GORM docs](https://gorm.io/docs/models.html).

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
    //  Modify a column. The second argument is the column name to change, matching the actual MySQL column name.
    err := tx.Migrator().AlterColumn(&TbDemoTest1660151543503{}, "name")
    if err != nil {
      return err
    }

    //  Add a column. The second argument is the column name to add, matching the actual MySQL column name.
    err = tx.Migrator().AddColumn(&TbDemoTest1660151543503{}, "desc")
    if err != nil {
      return err
    }

    //  Drop a column. The second argument is the column name to drop, matching the actual MySQL column name.
    err = tx.Migrator().DropColumn(&TbDemoTest1660151543503{}, "desc")
    if err != nil {
      return err
    }

    return tx.Create(&common.Migration{
      Version: version,
    }).Error
  })
}

// TbDemoTest table model — recommended to keep the version number prefix matching the generated filename
type TbDemoTest1660151543503 struct {
  models.Model
  Name string `json:"name" gorm:"type:varchar(128);comment:名称"`
  Desc string `json:"desc" gorm:"type:varchar(255);comment:描述"` // the field being added
  models.ModelTime
  models.ControlBy
}

func (TbDemoTest1660151543503) TableName() string {
  return "tb_demo_test" # sets the table name
}
```

3. Run the migration

```shell
$ go run main.go migrate -c config/settings.yml

Note: sqlite needs the -tags=sqlite3,json1 flag
$ go run -tags=sqlite3,json1 main.go migrate -c config/settings.yml
```

Once it runs successfully, check the database and inspect the `tb_demo_test` table to verify the column change matches what was expected.

## Seeding Table Data

Approach: read the `sql` statements line by line and write them into the MySQL table. You can import the SQL into a MySQL table first, then export insert statements with a tool like Navicat.

Q: If the table already has data, why write a migration file that inserts it too?
A: When the system goes to production, the ops team still needs to migrate that data.

1. Generate the migration file

Run:

```sh
$ go run main.go migrate  -a -g
generate migration file
```

Once that's done, open the `cmd/migrate/migration/version` directory — a new migration file has been added for you, `1668407576412_migrate.go` (usually at the bottom of the listing).

Tip:
Don't change the version-number part of a migration filename. The rest can be renamed to something meaningful, which makes the file easier to recognize later.
For example, `1668407576412_migrate.go` renamed to `1668407576412_insertSql_TbDemoTest.go` makes it obvious at a glance this inserts data into `tb_demo_test`.

2. Edit the migration file

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

// path to the sql file whose statements get written in
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

3. Prepare the `sql` file

   Export the data you want to seed from the database. The export needs to be `INSERT` statements, not the full table schema.

   Exporting from the command line (recommended — no GUI tool required):

```sh
# --no-create-info exports only the data, not the CREATE TABLE statement
# --complete-insert generates INSERT statements with column names, so the field order doesn't matter
$ mysqldump -h 127.0.0.1 -u root -p \
    --no-create-info --complete-insert --skip-extended-insert \
    dbname tb_demo > 1668407576412_insertSqlTbDemoTest.sql
```

   If using a GUI tool like Navicat or DBeaver, select the target table → export wizard → choose SQL format →
   check "data only" → choose a save location → finish.

   Put the exported file under `cmd/migrate/migration/version/`, naming it to match the corresponding migration file,
   so it's easy to keep track of and so the migration file above can read it:

```sql
INSERT INTO tb_demo (`id`, `name`, `created_at`, `updated_at`, `deleted_at`, `create_by`, `update_by`) VALUES (1, 'Zhang San', '2022-11-20 16:59:41.000', '2022-11-26 16:59:47.000', '2022-11-25 16:59:50.000', 1, 1);
INSERT INTO tb_demo (`id`, `name`, `created_at`, `updated_at`, `deleted_at`, `create_by`, `update_by`) VALUES (2, 'Li Si', '2022-11-20 16:59:41.000', '2022-11-26 16:59:47.000', '2022-11-25 16:59:50.000', 1, 1);
```

4. Run the migration

```sh
$ go run main.go migrate -c config/settings.yml

Note: sqlite needs the -tags=sqlite3,json1 flag
$ go run -tags=sqlite3,json1 main.go migrate -c config/settings.yml
```

5. Extending this:
   If you have multiple SQL files, adapt the code above to loop over an array of file paths and write each one's data in turn.

6. That's it.
   Thanks for using go-admin — stars and recommendations are always appreciated.

## Reference

Video walkthroughs (recorded on the subscription edition; the steps apply to the open-source edition too):

[[go-admin-pro] Doing data migration the graceful way — the migrate command](https://www.bilibili.com/video/BV13Y4y1A7n2?spm_id_from=333.999.0.0)

[[go-admin-pro] Common issues with the migrate command](https://www.bilibili.com/video/BV1wS4y1x7g2?spm_id_from=333.999.0.0)
