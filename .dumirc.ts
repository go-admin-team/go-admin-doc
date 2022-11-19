import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    name: 'go-admin',
    rtl: true,
    mode: 'doc',
    autoAlias: true,
    logo:
      'https://raw.githubusercontent.com/wenjianzhang/image/master/img/go-admin.png',
    footer: `Open-source MIT Licensed | Copyright © 2020-present
    <br />
    Powered by go-admin-team`,
    navs: {
      'en-US': [
        null,
        { title: 'GitHub', path: 'https://github.com/go-admin-team/go-admin' },
        {
          title: 'Changelog',
          path: 'https://github.com/go-admin-team/go-admin/releases',
        },
      ],
    },
    sitemap: {
      hostname: 'https://www.go-admin.pro',
    },
    extraBabelPlugins: [
      [
        'import',
        {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: 'css',
        },
      ],
    ],
    fastRefresh: {},
    hash: true,
    scripts: ['https://hm.baidu.com/hm.js?f98a2f382011d17906899de9f676b294'],
    // more config: https://d.umijs.org/config
    ssr: process.env.NODE_ENV === 'development' ? false : {},
  }
});

