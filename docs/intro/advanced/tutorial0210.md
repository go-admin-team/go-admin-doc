---
nav:
  title: 开发
  order: 2
  second:
    title: 进阶
    order: 1
group:
  title: 前端基础
  order: 3
title: 前端目录结构
order: 1
toc: content
description: go-admin-ui 前端项目的目录结构说明：src 下各目录的职责与页面文件的组织方式。
keywords: [go-admin-ui 目录结构, vue3 项目结构, vue 工程组织]
---

看一下 go-admin-ui 的目录结构：

```bash
.
├── index.html            # 入口 HTML
├── vite.config.mjs       # Vite 配置
├── package.json
├── pnpm-lock.yaml        # 用 pnpm 管理依赖，见下方说明
├── jsconfig.json
├── public                # 静态文件，原样拷贝到构建产物
├── src
│   ├── main.js           # 应用入口
│   ├── App.vue           # 根组件
│   ├── api               # 按模块组织的接口调用
│   ├── components        # 公共组件
│   ├── directive         # 自定义指令，如权限指令 v-permisaction
│   ├── icons              # 图标
│   ├── layout             # 整体布局
│   ├── mixins             # 列表页等场景复用的逻辑（如 crud mixin）
│   ├── router              # 路由配置
│   ├── store                # 状态管理（Vuex）
│   ├── styles                # 全局样式
│   ├── utils                  # 工具函数，包含请求封装
│   ├── vendor                  # 第三方脚本的本地拷贝
│   ├── views                    # 页面
│   ├── permission.js             # 路由守卫，处理登录态与动态路由
│   └── settings.js                # 全局配置项
├── .env.development
├── .env.production
└── .env.staging               # 预发布环境配置
```

几个和后端习惯不同、容易搞混的地方：

- **没有 `dist` 目录**——它是构建产物，不在版本库里，执行 `pnpm build:prod` 后才会生成；
- 依赖用 **pnpm** 管理（见 `pnpm-lock.yaml`），不是 npm 或 yarn，见 [Node 环境](/guide/vue-install)；
- `mixins/` 目前仍在使用（例如列表页的 crud 逻辑），并非历史遗留，新增列表页时可以复用。

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
