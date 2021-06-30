# 编写 go-admin 应用,第 2 步

这部分教程从 教程第 1 步 结尾的地方继续讲起。我们将建立数据库，创建您的第一个模型。

:::tip 从哪里获得帮助：
如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。
:::

## 数据库配置

现在，打开 `config/settings.yml` 。这是个包含了 `go-admin` 项目的配置信息。

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
1、 gen > dbname 此配置可以根据数据库名称来获取该数据库下所有 table，进行代码生成；
2、 gen > frontpath 代码生成是使用前端代码存放位置，需要指定到 src 文件夹，相对路径;代码要求 go-admin 和 go-admin-ui 必须在同一级目录下

当前我们先通过 sql 脚本的方式来创建数据库表信息。[表结构定义需要查看](/guide/db.html)

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

## 代码生成

启动`go-admin` ，进入系统

<img class="no-margin" src="
https://gitee.com/mydearzwj/image/raw/master/img/dashboradv1.0.0.png"  height="500px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

打开以上程序画面，程序左侧有两个菜单，

1. 系统管理
2. 系统工具

<img class="no-margin" src="
https://gitee.com/mydearzwj/image/raw/master/img/genv1.0.0.png"  height="500px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

### 表结构导入

现在我们打开系统工具，进入 `代码生成` ，下边的画面请点击`导入`

:::tip
这里的导入是要将我们刚刚创建的表导入到系统中，这样我们就可以根据表来生成代码了。
:::

<img class="no-margin" src="
https://gitee.com/mydearzwj/image/raw/master/img/genimport1v1.0.0.png"  height="400px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

选择刚才创建的 `article` 并点击 `确认` 按钮，将表结构导入系统。

<img class="no-margin" src="
https://gitee.com/mydearzwj/image/raw/master/img/genimport2v1.0.0.png"  height="400px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

### 编辑模板字段

确定后，表结构进存储到了代码生成工具里，此时我们需要对导入数据进行编辑。

<img class="no-margin" src="
https://gitee.com/mydearzwj/image/raw/master/img/genimport3v1.1.0.png"  height="200px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

编辑红框里边的选项，之后点击保存。

<img class="no-margin" src="
https://gitee.com/mydearzwj/image/raw/master/img/genimport4v1.0.0.png"  height="400px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

### 预览代码

可以在预览处看到工具生成的代码。

<img class="no-margin" src="
https://gitee.com/mydearzwj/image/raw/master/img/genimport5v1.0.0.png"  height="400px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

### 生成代码

到这里我们的第一个程序进行的很顺利，下一步会更顺利， 点击`代码生成`，此时 前后端代码都会进入自己该到的位置，另外需要注意一点：如果需要带权限的代码，那就选择`代码生成【带权限】`，他们的区别就是路由注册时，一个添加的认证中间件，一个没有；

重启前端服务，接下来开始处理页面显示。

### 配置系统菜单

1. 返回列表页，点击`生成配置`；菜单的配置直接进入数据库中；是不是很简单啊！

### 配置系统菜单绑定接口

1. 首先需要将新增的 api 自动托管到接口管理中，需要重新`编译并启动`项目；

按照一下命令直接操作即可；

```sh
$ go-admin server -c=config/settings.dev.yml -a=false
```

`server` 命令中我们新追加了`-a`参数，默认情况下为`false`,当设置为`true`时，就会对当前程序所有的 api 进行检查并创建；

2. 进入接口管理，编辑新追加的接口信息，

### 配置角色权限

> 首先进入角色管理，打开角色列表。

<img class="no-margin" src="https://gitee.com/mydearzwj/image/raw/master/img/setrole1v1.0.0.png"  height="200px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

> 选择超级管理员，点击修改，勾选我们刚才添加的菜单以及 api 接口，保存。

<img class="no-margin" src="https://gitee.com/mydearzwj/image/raw/master/img/setrole2v1.0.0.png"  height="400px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

> 刷新页面，刚刚授权的菜单就出来了。

<img class="no-margin" src="https://gitee.com/mydearzwj/image/raw/master/img/menu1v1.0.0.png"  height="300px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

### 操作内容管理

这个时候我们的内容管理已经添加完成了，里边已经具备了增删改查功能。

> 列表

<img class="no-margin" src="https://gitee.com/mydearzwj/image/raw/master/img/article1v1.0.0.png"  height="300px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

> 新增

<img class="no-margin" src="https://gitee.com/mydearzwj/image/raw/master/img/article2v1.0.0.png"  height="300px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

> 修改

<img class="no-margin" src="https://gitee.com/mydearzwj/image/raw/master/img/article3v1.0.0.png"  height="300px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

> 删除

<img class="no-margin" src="https://gitee.com/mydearzwj/image/raw/master/img/article4v1.0.0.png"  height="300px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

### 结束语

OK！，内容到这里已经介绍了开始第一个 go-admin 应用的全部过程，虽然图片居多，主要也是编码内容比较少，希望大家能够掌握，如在使用中遇到了什么问题都可以在 qq 群或者微信群中沟通交流！谢谢！

如果需要了解更进一步的 go-admin 相关内容，请前往[进阶](/guide/advanced/api.html) 继续查看！

:::tip 从哪里获得帮助：
如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。
:::
