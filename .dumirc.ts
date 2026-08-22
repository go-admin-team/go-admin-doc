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

  // en-US：全站（除 vip.md 外）已完整翻译。
  // ja-JP：首页 + guide 组（11 篇）已译，其余页面尚未翻译，会落回中文——这是预期行为。
  // zh-TW 还没有任何译稿，开启后语言切换器会把访客带到空站点，先留着注释。
  //
  // dumi 不做语言回退：缺少 `.{id}.md` 的页面在该语种下不会生成路由，而不是回退到中文。
  //
  // zh-CN 需保持在首位，它占据根路径，这样既有的中文 URL 不会变化。
  locales: [
    { id: 'zh-CN', name: '简体中文' },
    { id: 'en-US', name: 'English', base: '/en-US' },
    { id: 'ja-JP', name: '日本語', base: '/ja-JP' },
    // { id: 'zh-TW', name: '繁體中文', base: '/zh-TW' },
  ],


  // Same duplication problem as `title`: a site-wide description here shadows
  // the per-page one helmet injects. Description and keywords are declared in
  // each page's frontmatter instead.

  analytics: {
    ga_v2: 'G-CGFXG08VBT',
  },

  hash: true,

  // dumi's default sidebar and TOC CSS (theme-default/slots/Sidebar and Toc)
  // truncate group titles and links with `white-space: nowrap` + ellipsis,
  // sized for short Chinese labels. English (and Japanese) titles are longer
  // and were getting cut off mid-word, e.g. "STANDARD PRACT…" in the sidebar
  // and "Error: requires at least …" in the TOC. Let them wrap instead.
  // `styles` entries are injected before the theme's own stylesheet, so equal-
  // specificity rules there still lose on source order — `!important` is
  // needed to actually win the cascade.
  //
  // No `>` child combinators here: dumi's SSR HTML-escapes this raw CSS
  // string into the <style> tag (`>` becomes `&gt;`), which the browser's CSS
  // parser can't decode — an invalid selector in a comma-separated list
  // invalidates the whole rule, silently dropping the fix in production
  // builds even though it works in dev (where styles are injected as
  // unescaped JS instead). Descendant (space) selectors sidestep this.
  styles: [
    `
    .dumi-default-sidebar dl dt,
    .dumi-default-sidebar dl dd a,
    .dumi-default-toc li a {
      white-space: normal !important;
      overflow: visible !important;
      text-overflow: unset !important;
    }
    .dumi-default-toc li a {
      line-height: 1.4 !important;
    }
    `,
  ],

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
