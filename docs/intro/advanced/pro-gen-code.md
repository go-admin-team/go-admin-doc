---
group:
  title: 高级使用
  order: 10
title: 代码工具
order: 500
toc: content
---

### 代码工具使用

#### Agent启动

1. 建议启动脚本跟项目在同一个目录,脚本文件需要联系博主获取；

![agent](https://doc-image.zhangwj.com/img/pro-gen-code-agent.png)

2.  根据电脑环境选择其中一个即可；
3.  chmod +x go-admin-agent-darwin-amd64
4.  ./go-admin-agent-darwin-amd64 -p 9999 -a xxx-xxx-xxxx-xxx 授权码在 https://vip.go-admin.pro/user/login 代码生成平台个人中心查询如下图
5.  ![个人中心](https://doc-image.zhangwj.com/img/pro-gen-code-usercenter.png)

6.  ![agent_success](https://doc-image.zhangwj.com/img/pro-gen-code-agent_success.png)

7.  恭喜你启动成功;

#### 准备工作

##### 表结构准备

1.在线新增

2.Sql导入

3.json导入

点击对应入口对应都有提示，根据提示导入即可

##### 数据库属性

**重点说下默认定义的字段：created_at, updated_at, deleted_at 这里选择string不需要刻意选择time.time;**

![数据库属性](https://doc-image.zhangwj.com/img/pro-gen-code-dbconfig.png)

##### 页面属性

![页面属性](https://doc-image.zhangwj.com/img/pro-gen-code-pageconfig.png)

**重点说下下拉框：如果是通过字典的方式维护下拉的内容，希望页面动态显示字典内容的还需要在配置模块设置下如下图**

![下拉设置](https://doc-image.zhangwj.com/img/pro-gen-code-dropdownlist.png)

​ 系统会根据这个key自动在页面调用字典接口,下图是字典设置

![字典设置](https://doc-image.zhangwj.com/img/pro-gen-code-dictconfig.png)

##### 配置

1. 需要做表关联显示关联表的字段信息 假设业务场景：我有2张表，一张是商品表products 另外一张表是skus表，我想在skus表上显示商品表里的商品名称 转化成 sql 就是： select a.pro_id, b.name from skus as a join products as b on a.pro_id = b.code 其中 a.pro_id 跟 b.code 是关联条件 我们想显示 products.name在skus表 就如下图设置

![配置](https://doc-image.zhangwj.com/img/pro-gen-code-config-1.png)

2. 如果是跨app的 需要注意导入的 import { b } from "../b/service"; 修改b跟a的相对路径

##### 字段验证

目前规则比较简单主要是设置字段的是否必填

##### 生成信息

![生成信息](https://doc-image.zhangwj.com/img/pro-gen-code-info.png)

1.  代理工具跟项目的相对路径，因为上文是同目录 ./ 即可；

2.  前端和后端项目文件夹 就是项目的文件夹名字提交即可；

#### 生成代码

![工具](https://doc-image.zhangwj.com/img/pro-gen-code-tools.png)

点击对应表的操作栏目中的 **_..._** 选择代理生成即可；

##### 代理生成(重点)

​ 我们启动agent之后，配置好了对应的表设计之后点击代理生成即可直接把代码生成到项目当中；

##### 代码下载

​ 如果需要下载文件可以考虑，现在都是在线自动生成基本使用不上了；

##### 代码预览(重点)

​ 我们生成代码之前可以预览看看我们代码生成的结果，如果发现错误可以及时调整，后期如果增加字段但是又不想重新生成代码避免业务代码被覆盖，可以通过代码预览 拿出程序员必杀技复制粘贴 把修改内容贴到对应代码文件也是比较方便的；

##### Sql 预览

可以使用预览出现的sql，可以直接复制sql到数据库执行；

##### Access预览(重点)

针对前端项目权限使用的，在项目后期权限管理是很有必要的建议比点，会往src/access.ts追加, 找到文件拿出必杀技即可

##### Routes预览(重点)

​ 前端antd项目路由跟系统里面的菜单是2个不同的概念，这也是必须要设置的往configs/routes.ts追加，大家要根据实际自己的业务场景可能要做调整，因为很多情况下我们的多个表在少数的应用当中，routes 里面需要做下同应用的routes合并；

##### 多语言预览(重点)

​ 项目目前是支持中英文的，需要往src/locales/zh-CN/menu.ts 和 src/locales/zh-CN/pages.ts 追加内容，如果发现有自动生成不能识别的 开启浏览器调试模式在console 里面看下错误提醒，自行修改下即可；

#### 自定义表单（开发中）

注意事项

1.每添加一个输入框，都需要填写对应的映射key, 否则无法继续添加输入框；

2.下拉框支持请求后端服务接口可以获取动态数据

3.布局组件 Group 通过调整元素宽度可以调整输入框的布局

4.支持预览看效果

![表单](https://doc-image.zhangwj.com/img/pro-gen-code-form.png)
