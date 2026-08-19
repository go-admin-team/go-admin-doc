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

  // 首页 + guide 组（11 篇）已译成英文，先只开 zh-CN / en-US。
  // ja-JP、zh-TW 还没有任何译稿，开启后语言切换器会把访客带到空站点，
  // 等实际翻译后再取消下面两行的注释，并同步 scripts/postbuild-seo.mjs 的 LOCALE_BASES。
  //
  // dumi 不做语言回退：缺少 `.{id}.md` 的页面在该语种下不会生成路由，而不是回退到中文。
  // guide 之外的页面（configure、intro 等）目前还没有英文版，英文站访客点到这些链接
  // 时会落回中文页——这是预期行为，不是 bug。
  //
  // zh-CN 需保持在首位，它占据根路径，这样既有的中文 URL 不会变化。
  locales: [
    { id: 'zh-CN', name: '简体中文' },
    { id: 'en-US', name: 'English', base: '/en-US' },
    // { id: 'ja-JP', name: '日本語', base: '/ja-JP' },
    // { id: 'zh-TW', name: '繁體中文', base: '/zh-TW' },
  ],


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
    // dumi 2 uses `nav` (dumi 1's `navs` is ignored).
    //
    // A bare array REPLACES the nav dumi derives from each page's `nav`
    // frontmatter, which dropped 指南 / 指令 / 开发 / 高阶 / 授权 / 帮助 from the
    // header and left only these two links — the doc groups were reachable
    // only by editing the URL. `mode: 'append'` keeps the generated items and
    // adds these after them.
    nav: {
      mode: 'append',
      value: [
        { title: 'GitHub', link: 'https://github.com/go-admin-team/go-admin' },
        {
          title: 'Changelog',
          link: 'https://github.com/go-admin-team/go-admin/releases',
        },
      ],
    },
  },
});
