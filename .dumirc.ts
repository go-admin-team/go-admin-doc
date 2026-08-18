import { defineConfig } from 'dumi';

// 注意：ssr / sitemap / hash / metas / analytics 等均为 dumi 顶层配置。
// 此前它们被写在 themeConfig 内部，dumi 2 不会读取，导致：
//   - 无预渲染，每个页面产出的 HTML 都是同一份 428 字节空壳
//   - 不生成 sitemap.xml
//   - 百度统计脚本未注入
// themeConfig 只接受传递给主题的配置（name / logo / footer / nav 等）。
export default defineConfig({
  // No top-level `title`. umi writes it straight into the HTML template while
  // the default theme injects a second <title> from each page's frontmatter
  // via react-helmet. Two <title> tags end up in <head>, and crawlers read the
  // first one, so every page was indexed as "go-admin". Page titles now come
  // from frontmatter alone.
  favicons: ['https://doc-image.zhangwj.com/img/go-admin.png'],

  // 预渲染。开发模式关闭以保证热更新速度，构建时开启，
  // 使爬虫无需执行 JS 即可取到正文
  ssr: process.env.NODE_ENV === 'development' ? false : {},

  sitemap: {
    hostname: 'https://www.go-admin.pro',
  },

  // Same duplication problem as `title`: a site-wide description here shadows
  // the per-page one helmet injects. Description and keywords are declared in
  // each page's frontmatter instead.

  analytics: {
    ga_v2: 'G-CGFXG08VBT',
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
