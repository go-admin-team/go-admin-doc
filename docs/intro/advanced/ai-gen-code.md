---
nav:
  title: 开发
  order: 2
  second:
    title: 进阶
    order: 1
group:
  title: 代码生成
  order: 6
title: 用 AI 生成代码
order: 7
toc: content
description: 用大模型生成 go-admin 业务代码的提示词写法：为什么直接让模型写会失败，提示词该包含哪三个要素，以及新增模块、复杂业务、补测试、写迁移等场景的可复制模板。
keywords: [AI 生成代码 提示词, go-admin AI 开发, AGENTS.md, 大模型 写 golang, cursor 提示词]
---

# 用 AI 生成代码

前面几节讲的是[代码生成器](/intro/advanced/tutorial0420) —— 读数据表结构、按模板产出代码，
结果确定可复现。本节讲另一条路：用大模型生成代码，适合生成器覆盖不到的部分，比如业务逻辑、
改造既有代码、补测试。

## 为什么直接让模型写会失败

把"帮我写一个 go-admin 模块"丢给模型，产出通常不能直接用。原因不在模型：

go-admin 的公开代码横跨数年，早期每个模块都要手写 Api 与 Service，每个 Api 至少七个函数。
模型训练时看到的多半是这套写法。而当前仓库对单表增删改查推荐的是
[Actions 模式](/intro/advanced/advanced) —— 一个模块只有 model、dto、router 三个文件，
不写 Api 与 Service。

两种写法都能跑，所以模型不会报错，你也不会立刻发现。等项目里两套风格混在一起，再改回来就贵了。

## 提示词的三个要素

有效的提示词不是把规范复述给模型，而是**告诉它去读什么**。三个要素缺一不可：

### 1. 指向约定文件

go-admin 与 go-admin-ui 的根目录各有一份 `AGENTS.md`,专门写给 AI 编码工具，内容是分层边界、
通用 Action 的使用前提、命名规则、几条红线。它刻意不复述技术栈版本（以 `go.mod` 为准）和命令
（以 `Makefile` 为准），避免与代码脱节。

部分工具会自动读取根目录的 `AGENTS.md`;不确定手上的工具是否支持，就在提示词里明确要求读一遍。

### 2. 指定可编译的参照物

`AGENTS.md` 里这句话是关键：

> 标准 CRUD 模块的完整写法见 `app/demo/` —— 那是可编译、有测试、CI 会跑的参照物。
> 本文与它冲突时，以 `app/demo/` 为准。

文字描述会过时，**能编译且被 CI 跑过的代码不会**。`app/demo/` 只有五个文件，模型读完代价很小，
却同时给出了目录结构、命名、DTO 标签写法和路由注册方式 —— 比任何规范描述都准确。

### 3. 划清边界

明确说不要做什么，比只说要做什么有效。模型倾向于"多给一点",常见的是顺手补出 apis 与 service
文件，而 Actions 模式下这两个文件根本不该存在。

## 提示词模板

### 新增一个标准模块

```text
为 tb_article 表新增业务模块。

开始前先读：
- 根目录 AGENTS.md
- app/demo/ 下的全部文件（这是标准写法的参照，与 AGENTS.md 冲突时以它为准）

要求：
1. 使用 common/actions 的通用 Action，不要手写 Api 与 Service；
2. 只创建 model、dto、router 三个文件；
3. Generate() 必须返回副本，不要就地返回；
4. 完成后确认 cmd/api/ 中已用 _ 导入新包。

表结构：
CREATE TABLE `tb_article` (
  ...
);
```

第 3 条单独写出来，是因为它是最容易出错也最难发现的一处：通用 Action 在并发请求之间复用实例，
`Generate()` 就地返回会导致请求之间串数据。这个问题在单人测试时几乎不出现，上线后才暴露。

### 业务超出单表增删改查

```text
这个接口需要跨表事务，通用 Action 不适用。

参照 app/admin/apis/sys_post.go 和对应的 service 手写 Handler 与 Service，
遵守 AGENTS.md 的分层约束：
- Api 不直接操作 Orm；
- Service 不接触 gin.Context；
- 一律使用 e.Orm，不使用全局 DB 变量（多租户依赖请求上下文中的 Orm）。
```

### 改造既有代码

```text
把 app/xxx/ 模块从手写 Api + Service 改造成 Actions 模式。

先读 app/demo/ 确认目标写法，再逐个文件对照改造。
改造后 apis 与 service 目录应当为空，路由行为保持不变。
改完列出删除了哪些文件、新增了哪些文件。
```

要求模型**列出文件增删清单**,是为了让你不必逐个文件 diff 就能判断改造是否彻底。

### 补测试

```text
参照 app/demo/service/dto/demo_product_test.go 的写法，
为 xxx 模块的 dto 补测试，重点覆盖 Generate() 返回副本这一点。
```

### 写数据库迁移

```text
为 tb_article 表写一个迁移文件，放在 cmd/migrate/migration/version/ 目录下。

注意：
- 文件名前 13 位是时间戳版本号；
- 必须放 version/ 而不是 version-local/，后者在 .gitignore 中，提交时会被忽略；
- 已执行过的迁移文件不可修改，需要修正时新增一个迁移。
```

目录这条必须写明：`version-local/` 已被 `.gitignore` 忽略，放错了 `git status` 看不到，
PR 里也不会出现，等到别人拉代码才发现表没建。

## 生成之后检查什么

模型的产出需要人来把关。下面几条对照 `AGENTS.md` 的红线，也是实际出问题最多的地方：

| 检查项 | 出错后果 |
| --- | --- |
| `Generate()` 是否返回副本 | 并发请求之间串数据 |
| 是否使用 `e.Orm` 而非全局 DB | 多租户下拿到错误的数据库连接 |
| Service 里是否出现 `gin.Context` | 越过分层边界 |
| `TableName()` 是否显式声明 | GORM 配置了 `SingularTable`,不会自动推导 |
| 免认证路由注册到哪个切片 | 应为 `routerNoCheckRole`,详见[路由注册](/intro/advanced/router) |
| 迁移文件放在哪个目录 | 放进 `version-local/` 会被忽略 |
| 权限标识是否与前端一致 | 需同时写入 `sys_menu` 种子数据 |

:::warning
不要把 `config/settings.yml` 的真实内容贴给 AI 工具。`database.source` 含数据库账号密码，
`jwt.secret` 泄露后可被用来伪造任意用户的 token。需要模型理解配置结构时，贴脱敏后的片段，
或直接引用[配置参考](/configure/settings)。

:::

## 和代码生成器怎么选

| | 代码生成器 | AI 生成 |
| --- | --- | --- |
| 适用 | 标准增删改查 | 业务逻辑、改造既有代码、补测试 |
| 结果 | 确定、可复现 | 需要人工审阅 |
| 前置条件 | 表结构符合[数据库表规范](/intro/advanced/db) | 提供 `AGENTS.md` 与参照代码 |

标准模块优先用代码生成器 —— 更快，也不需要审阅。AI 用在生成器覆盖不到的地方。

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
