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

![agent](https://raw.githubusercontent.com/wenjianzhang/image/master/img/pro-gen-code-agent.png)

2.  根据电脑环境选择其中一个即可；
3.   chmod +x go-admin-agent-darwin-amd64
4.  ./go-admin-agent-darwin-amd64 -p 9999 -a   xxx-xxx-xxxx-xxx      授权码在  https://vip.go-admin.pro/user/login 代码生成平台个人中心查询如下图
5.  ![个人中心](https://raw.githubusercontent.com/wenjianzhang/image/master/img/pro-gen-code-usercenter.png)

6.  ![agent_success](https://raw.githubusercontent.com/wenjianzhang/image/master/img/pro-gen-code-agent_success.png)

7.  恭喜你启动成功;

 

#### 准备工作



##### 表结构准备

1.在线新增

2.Sql导入

3.json导入

点击对应入口对应都有提示，根据提示导入即可



#####    数据库属性

   **重点说下默认定义的字段：created_at, updated_at, deleted_at  这里选择string不需要刻意选择time.time;**

![数据库属性](https://raw.githubusercontent.com/wenjianzhang/image/master/img/pro-gen-code-dbconfig.png)





##### 页面属性

![页面属性](https://raw.githubusercontent.com/wenjianzhang/image/master/img/pro-gen-code-pageconfig.png)

**重点说下下拉框：如果是通过字典的方式维护下拉的内容，希望页面动态显示字典内容的还需要在配置模块设置下如下图**

##### 配置

![配置](https://raw.githubusercontent.com/wenjianzhang/image/master/img/pro-gen-code-config.png)

1. 需要在配置中设置对应的字典key,  设置你在字典里面添加的字段的key, 系统会根据这个key自动在页面调用字典接口,下图是字典设置

![image-20230420174518046](https://raw.githubusercontent.com/wenjianzhang/image/master/img/pro-gen-code-config.png)


2. 需要做表关联显示关联表的字段信息 比如：select a.name,b.code form a join b on a.id = b.key   在id 里面维护如下信息

  	外链表：b；
  	
  	记录字段：key;
  	
  	显示字段：b.code;

3. 如果是跨app的 需要注意导入的 import { b } from "../b/service"; 修改b跟a的相对路径



##### 字段验证

   目前规则比较简单主要是设置字段的是否必填



##### 生成信息

![生成信息](https://raw.githubusercontent.com/wenjianzhang/image/master/img/pro-gen-code-info.png)

1.  代理工具跟项目的相对路径，因为上文是同目录 ./ 即可；

2.  前端和后端项目文件夹 就是项目的文件夹名字提交即可；



#### 生成代码

![工具](https://raw.githubusercontent.com/wenjianzhang/image/master/img/pro-gen-code-tools.png)

点击对应表的操作栏目中的   ***...*** 选择代理生成即可； 

代理生成 ，代码预览， Access预览， Routes预览，多语言预览  PRO 版本都是要用到的，点击看下分别的作用；



#### 自定义表单（开发中）

注意事项

1.每添加一个输入框，都需要填写对应的映射key, 否则无法继续添加输入框；

2.下拉框支持请求后端服务接口可以获取动态数据

3.布局组件 Group 通过调整元素宽度可以调整输入框的布局

4.支持预览看效果

![表单](https://raw.githubusercontent.com/wenjianzhang/image/master/img/pro-gen-code-form.png)

