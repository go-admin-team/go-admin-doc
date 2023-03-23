---
nav: 开发
group:
  title: 代码生成
title: 代码生成
order: 2
toc: content
---

## 代码生成

启动`go-admin` ，进入系统

<img src="https://raw.githubusercontent.com/wenjianzhang/image/master/img/dashboradv1.0.0.png" width="700xp" />

打开以上程序画面，程序左侧有两个菜单，

1. 系统管理
2. 系统工具

<img src="https://raw.githubusercontent.com/wenjianzhang/image/master/img/genv1.0.0.png" width="300xp" />

### 表结构导入

现在我们打开系统工具，进入 `代码生成` ，下边的画面请点击`导入`

:::success
这里的导入是要将我们刚刚创建的表导入到系统中，这样我们就可以根据表来生成代码了。

:::

<img src="https://raw.githubusercontent.com/wenjianzhang/image/master/img/genimport1v1.0.0.png" width="700xp" />

选择刚才创建的 `article` 并点击 `确认` 按钮，将表结构导入系统。

<img src="https://raw.githubusercontent.com/wenjianzhang/image/master/img/genimport2v1.0.0.png" width="700xp" />

### 编辑模板字段

确定后，表结构进存储到了代码生成工具里，此时我们需要对导入数据进行编辑。

<img src="https://raw.githubusercontent.com/wenjianzhang/image/master/img/genimport3v1.1.0.png" width="700xp" />

编辑红框里边的选项，之后点击保存。

<img src="https://raw.githubusercontent.com/wenjianzhang/image/master/img/genimport4v1.0.0.png" width="700xp" />

### 预览代码

可以在预览处看到工具生成的代码。

<img src="https://raw.githubusercontent.com/wenjianzhang/image/master/img/genimport5v1.0.0.png" width="700xp" />

### 生成代码

到这里我们的第一个程序进行的很顺利，下一步会更顺利， 点击`代码生成`，此时 前后端代码都会进入自己该到的位置，另外需要注意一点：如果需要带权限的代码，那就选择`代码生成【带权限】`，他们的区别就是路由注册时，一个添加的认证中间件，一个没有；

重启前端服务，接下来开始处理页面显示。
