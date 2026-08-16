import { defineConfig } from 'dumi';

// 注意：ssr / sitemap / hash / metas / analytics 等均为 dumi 顶层配置。
// 此前它们被写在 themeConfig 内部，dumi 2 不会读取，导致：
//   - 无预渲染，每个页面产出的 HTML 都是同一份 428 字节空壳
//   - 不生成 sitemap.xml
//   - 百度统计脚本未注入
// themeConfig 只接受传递给主题的配置（name / logo / footer / nav 等）。
export default defineConfig({
  title: 'go-admin',
  favicons: ['https://doc-image.zhangwj.com/img/go-admin.png'],

  // 预渲染。开发模式关闭以保证热更新速度，构建时开启，
  // 使爬虫无需执行 JS 即可取到正文
  ssr: process.env.NODE_ENV === 'development' ? false : {},

  sitemap: {
    hostname: 'https://www.go-admin.pro',
  },

  metas: [
    {
      name: 'description',
      content:
        'go-admin 是基于 Gin + Vue 3 + Element Plus 的前后端分离权限管理系统，内置 JWT 认证、Casbin 权限控制、多租户与数据权限、定时任务等能力。本站为官方使用文档。',
    },
    {
      name: 'keywords',
      content:
        'go-admin,Gin,Golang,Vue3,Element Plus,权限管理系统,后台管理系统,RBAC,Casbin,JWT,快速开发框架',
    },
  ],

  analytics: {
    baidu: 'f98a2f382011d17906899de9f676b294',
  },

  hash: true,

  themeConfig: {
    name: 'go-admin',
    rtl: true,
    prefersColor: { default: 'auto' },
    logo: 'https://doc-image.zhangwj.com/img/go-admin.png',
    footer: `Open-source MIT Licensed | Copyright © 2020-present
    <br />
    Powered by go-admin-team`,
    // dumi 2 为 nav（此前写作 navs，是 dumi 1 的键名，不生效）。
    // 使用数组形式以便在所有语言下都显示
    nav: [
      { title: 'GitHub', link: 'https://github.com/go-admin-team/go-admin' },
      {
        title: 'Changelog',
        link: 'https://github.com/go-admin-team/go-admin/releases',
      },
    ],
  },
});
