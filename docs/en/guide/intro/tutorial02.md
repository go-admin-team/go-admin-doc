# 编写 go-admin 应用,第 2 步

这部分教程从 教程第 1 步 结尾的地方继续讲起。我们将建立数据库，创建您的第一个模型。

:::tip 从哪里获得帮助：
如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。
:::

## 数据库配置

现在，打开 `config/settings.yml` 。这是个包含了 `go-admin` 项目的配置信息。

```bash
  database:
    database: dbname
    dbtype: mysql
    host: 127.0.0.1
    password: password
    port: 3306
    username: root
```

修改数据库配置信息。

当前我们先通过 sql 脚本的方式来创建数据库表信息。

```sql
CREATE TABLE `article` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编码',
  `title` varchar(128) DEFAULT NULL COMMENT '标题',
  `author` varchar(128) DEFAULT NULL COMMENT '作者',
  `content` varchar(255) DEFAULT NULL COMMENT '内容',
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
https://gitee.com/mydearzwj/image/raw/master/img/genimport3v1.0.0.png"  height="200px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

编辑红框里边的选项，之后点击保存。

<img class="no-margin" src="
https://gitee.com/mydearzwj/image/raw/master/img/genimport4v1.0.0.png"  height="400px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

### 预览代码

可以在预览处看到工具生成的代码。

<img class="no-margin" src="
https://gitee.com/mydearzwj/image/raw/master/img/genimport5v1.0.0.png"  height="400px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

## 编写代码

到这里我们的第一个程序进行的很顺利，下一步我们在项目中创建文件，找到`apis` 文件夹和`models`文件夹，分别创建 demo.go（注意：实际项目中根据业务确定命名）。

models/demo.go 文件我们需要稍作修改，修改内容如下：

当前文件

1. 全部 `if e.ArticleId != "" {` 替换成 `if e.ArticleId != 0 {` 。

2. 删除以下内容：

```
  CreatedAt string `json:"createdAt" gorm:"type:timestamp;"` //

	UpdatedAt string `json:"updatedAt" gorm:"type:timestamp;"` //

	DeletedAt string `json:"deletedAt" gorm:"type:timestamp;"` //
```

这个时候，models 和 apis 已经创建好了。

### 添加路由

打开 router/router.go 文件，找到
`auth.Use(authMiddleware.MiddlewareFunc()).Use(middleware.AuthCheckRole()) {`

添加一下内容：

```go
		auth.GET("/articleList",apis.GetArticleList)
		auth.GET("/article/:articleId",apis.GetArticle)
		auth.POST("/article",apis.InsertArticle)
		auth.PUT("/article",apis.UpdateArticle)
		auth.DELETE("/article/:articleId",apis.DeleteArticle)
```

到这一步我们的业务 api 已经写好了，重启前端服务，接下来开始处理页面显示。

### 创建 VIEWS 和 JS

1. 打开前端项目 `src/api` 目录下，创建`article.js`，并把预览内容直接复制到文件；
2. 打开`src/views` 目录，创建 `article` 文件夹，并在里边创建 `index.vue` ，并把预览内容直接复制到文件；

index.vue 文件中需要对编辑对话框进行修改
删除

```js
<el-form-item label="编码" prop="articleId">
  <el-input v-model="form.articleId" placeholder="编码" />
</el-form-item>
```

和

```js
<el-form-item label="" prop="createdAt">
  <el-input v-model="form.createdAt" placeholder="" />
</el-form-item>
<el-form-item label="" prop="updatedAt">
  <el-input v-model="form.updatedAt" placeholder="" />
</el-form-item>
<el-form-item label="" prop="deletedAt">
  <el-input v-model="form.deletedAt" placeholder="" />
</el-form-item>
<el-form-item label="" prop="createdBy">
  <el-input v-model="form.createdBy" placeholder="" />
</el-form-item>
<el-form-item label="" prop="updatedBy">
  <el-input v-model="form.updatedBy" placeholder="" />
</el-form-item>
```

此时前端项目已经开发完成。

### 配置系统菜单

1. 打开系统进入`系统管理`，点击`菜单管理`，`添加`菜单；首先创建目录。内容如下图：

> 先添加一个目录：

<img class="no-margin" src="https://gitee.com/mydearzwj/image/raw/master/img/addmenu1v1.0.0.png"  height="400px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

> 刷新一下列表中：

<img class="no-margin" src="https://gitee.com/mydearzwj/image/raw/master/img/addmenu2v1.0.0.png"  height="200px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

> 再添加一个菜单：

<img class="no-margin" src="https://gitee.com/mydearzwj/image/raw/master/img/addmenu3v1.0.0.png"  height="400px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

### 配置系统 api

> 选择 `接口权限` 添加 `内容管理` 和 `文章管理`

添加 `内容管理` 目录

<img class="no-margin" src="https://gitee.com/mydearzwj/image/raw/master/img/addapi1v1.0.0.png"  height="400px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

添加 `文章管理` 菜单

<img class="no-margin" src="https://gitee.com/mydearzwj/image/raw/master/img/addapi2v1.0.0.png"  height="400px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

> 分别创建增删改查以及列表接口，如下图

添加 `创建` 接口

<img class="no-margin" src="https://gitee.com/mydearzwj/image/raw/master/img/addapi3v1.0.0.png"  height="400px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

添加 `修改` 接口

<img class="no-margin" src="https://gitee.com/mydearzwj/image/raw/master/img/addapi4v1.0.0.png"  height="400px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

添加 `删除` 接口

<img class="no-margin" src="https://gitee.com/mydearzwj/image/raw/master/img/addapi5v1.0.0.png"  height="400px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

添加 `分页` 接口

<img class="no-margin" src="https://gitee.com/mydearzwj/image/raw/master/img/addapi6v1.0.0.png"  height="400px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

添加 `通过id查询` 接口，注意这里的路由地址配置

<img class="no-margin" src="https://gitee.com/mydearzwj/image/raw/master/img/addapi7v1.0.0.png"  height="400px" style="margin:0 auto;box-shadow: 5px 5px 5px #888888;">

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

:::tip 从哪里获得帮助：
如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。
:::
