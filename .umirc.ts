import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'go-admin',
  mode: 'site',
  logo: 'http://rcbrecjlk.hd-bkt.clouddn.com/img/go-admin.png',
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
  // more config: https://d.umijs.org/config
});
