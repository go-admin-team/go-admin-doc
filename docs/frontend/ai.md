---
title: 配合 AI 来改
order: 40
toc: content
description: 用 Claude Code、Cursor 这类 AI 编程工具修改代码生成器生成的页面：go-admin-ui 项目自带 AGENTS.md 和 Skill，让 AI 知道项目的写法规范，改出来的代码和其他页面风格一致。
keywords: [AI 编程 go-admin, claude code 前端开发, cursor vue 开发, go-admin-ui AGENTS.md]
---

## 不会写代码，也能做超出生成器范围的调整

[上一篇](/frontend/gen)说过，代码生成器能搞定标准的增删改查，但没法处理"这个字段要加个特殊校验""这个下拉框的选项要从另一个接口拿"这类稍微超出模板的需求。这种时候不需要自己学 Vue——可以让 AI 编程工具（Claude Code、Cursor 等）在生成好的代码基础上帮你改。

前提是要让 AI 工具真正了解这个项目的写法，而不是凭它自己的经验乱写一气——不同项目的约定不一样，AI 如果按它"记忆里最常见的写法"来改，很可能改出一套和项目里其他页面完全不一致的代码。

## 项目已经替你准备好了

go-admin-ui 根目录下有一份 `AGENTS.md` 文件，专门写给 AI 编码工具看：页面该怎么搭、组件怎么用、有哪些一改就容易出错但不会报错的地方，都写在里面。像 Claude Code 这类工具打开项目时会自动读取这份文件。

项目里还有一个专门用来生成标准列表页的 **Skill**（`new-list-page`），把"照着项目里已有的 `src/views/demo/product/index.vue` 这个参照页面，生成一个新的搜索+表格+表单页面"这套流程写成了一份可以直接调用的步骤说明。哪怕你不需要用它从零生成页面，让 AI 工具知道这个 Skill 存在，改代码时也会参照同样的规范。

## 怎么跟 AI 说清楚需求

描述需求时，把这三件事说清楚，AI 改出来的代码基本不会跑偏：

1. **改哪个文件**。生成器生成的页面在 `src/views/{模块}/{页面}/index.vue`，对应的接口定义在 `src/api/{模块}/{页面}.ts`，先确认清楚具体路径。
2. **照哪个参照物**。让 AI 参照项目里已有的、结构类似的页面去改，而不是凭空写——比如"参照 `src/views/demo/product/index.vue` 的写法"。
3. **只改这一处，别的不动**。明确说清楚改动范围，避免 AI 顺手把其他没问题的地方也"优化"了。

一个具体例子，比如想给某个列表页的搜索栏加一个日期范围筛选：

```text
在 src/views/order/index.vue 的搜索栏里，新增一个下单日期的范围选择，
参照 src/views/demo/product/index.vue 的搜索栏写法，
用 el-date-picker 的 daterange 类型，绑定到 table.query 上新增的两个字段（开始日期、结束日期）。
只改这个文件的搜索栏部分，其他地方不要动。
```

## 改完之后怎么确认

跑 `pnpm dev`，在浏览器里实际操作一遍改动的功能，确认界面表现和预期一致。如果改动涉及权限按钮，记得切换到一个非超级管理员账号测试——超级管理员看不出权限判断是否生效，原因见[界面是怎么组织的](/frontend/jiegou)。

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin-ui/issues/new)。

:::
