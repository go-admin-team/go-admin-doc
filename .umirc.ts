import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'go-admin',
  mode: 'site',
  logo:
    'https://raw.githubusercontent.com/wenjianzhang/image/master/img/go-admin.png',
  navs: {
    'en-US': [
      null,
      { title: 'GitHub', path: 'https://github.com/go-admin-team/go-admin' },
      {
        title: 'Changelog',
        path: 'https://github.com/go-admin-team/go-admin/releases',
      },
    ],
    'zh-CN': [
      null,
      { title: 'GitHub', path: 'https://github.com/go-admin-team/go-admin' },
      {
        title: '更新日志',
        path: 'https://github.com/go-admin-team/go-admin/releases',
      },
    ],
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
  scripts: ['https://hm.baidu.com/hm.js?f98a2f382011d17906899de9f676b294'],
  // more config: https://d.umijs.org/config
});
