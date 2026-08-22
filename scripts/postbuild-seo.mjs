// Post-build pass over the pre-rendered HTML for things dumi does not emit.
//
// 1. `lang` on <html>. The default theme declares it through react-helmet, but
//    dumi's SSR does not apply helmet's html attributes to the template, so every
//    page ships as lang="en" whatever its locale. Crawlers and screen readers
//    read this attribute, so it has to be right in the static output.
//
// 2. hreflang alternates. Without them search engines treat the translations of
//    a page as competing duplicates rather than as versions of one document.
//
// 3. A self-referencing canonical link. nginx serves the static export as a
//    directory (200 on both "/foo/" and "/foo/index.html", 301 from "/foo" to
//    "/foo/"), so every page is reachable at more than one URL. Without a
//    canonical tag Google has no signal for which one is authoritative and
//    flags them as unresolved duplicates.
//
// Alternates are derived from the files that actually exist: a page only gets a
// hreflang pointing at a locale that really has that page, so a partially
// translated site never advertises a URL that 404s.
//
// Every URL this script emits (canonical, hreflang, and the sitemap patch
// below) uses the trailing-slash form, because that's the only one nginx
// serves without a redirect — pointing search engines at the no-slash form
// makes them spend a crawl hop on a 301 for every single page.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const HOSTNAME = 'https://www.go-admin.pro';
const DEFAULT_LOCALE = 'zh-CN';
// Non-default locale bases from .dumirc.ts; keep in sync when adding a locale.
// Kept in sync with the `locales` list in .dumirc.ts.
const LOCALE_BASES = ['en-US', 'ja-JP'];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name.endsWith('.html')) yield full;
  }
}

/** Split a file into its locale and the path shared across translations. */
function classify(file) {
  const segments = relative(DIST, file).split(sep);
  const locale = LOCALE_BASES.find((l) => segments[0] === l);
  return {
    locale: locale ?? DEFAULT_LOCALE,
    sharedPath: (locale ? segments.slice(1) : segments).join('/'),
  };
}

/** "guide/ksks/index.html" -> "/guide/ksks/"; "index.html" -> "/" */
function toUrlPath(sharedPath) {
  const trimmed = sharedPath.replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '');
  return trimmed ? `/${trimmed}/` : '/';
}

function toFullUrl(locale, urlPath) {
  const base = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return `${HOSTNAME}${base}${urlPath}`;
}

const files = [];
for await (const file of walk(DIST)) files.push(file);

// Which locales hold each shared path, so alternates only name real pages.
const localesByPath = new Map();
for (const file of files) {
  const { locale, sharedPath } = classify(file);
  if (!localesByPath.has(sharedPath)) localesByPath.set(sharedPath, new Set());
  localesByPath.get(sharedPath).add(locale);
}

let langPatched = 0;
let altPatched = 0;
let canonicalPatched = 0;

for (const file of files) {
  const { locale, sharedPath } = classify(file);
  let html = await readFile(file, 'utf8');
  const before = html;
  const urlPath = toUrlPath(sharedPath);

  html = html.replace(/<html([^>]*)\slang="[^"]*"/i, `<html$1 lang="${locale}"`);
  if (html !== before) langPatched += 1;

  if (html.includes('rel="canonical"')) {
    // dumi's own theme (DocLayout) already renders a canonical link from
    // `sitemap.hostname` + the raw route pathname, which has no trailing
    // slash — rewrite it in place to match the URL nginx actually serves.
    html = html.replace(/<link\b[^>]*\brel="canonical"[^>]*>/i, (tag) =>
      tag.replace(/href="([^"]*)"/, (attr, url) => (url.endsWith('/') ? attr : `href="${url}/"`)),
    );
    canonicalPatched += 1;
  } else {
    // A handful of routes (e.g. the ~demos catch-all) render without dumi's
    // own canonical; add a self-referencing one so every page still has one.
    html = html.replace(
      '</head>',
      `<link rel="canonical" href="${toFullUrl(locale, urlPath)}"/></head>`,
    );
    canonicalPatched += 1;
  }

  const available = localesByPath.get(sharedPath);
  // A page with no translation yet needs no alternates — a lone self-referencing
  // hreflang tells search engines nothing.
  if (available && available.size > 1 && !html.includes('hreflang=')) {
    const link = (loc) =>
      `<link rel="alternate" hreflang="${loc}" href="${toFullUrl(loc, urlPath)}"/>`;
    const tags = [...available].sort().map(link);
    if (available.has(DEFAULT_LOCALE)) {
      tags.push(
        `<link rel="alternate" hreflang="x-default" href="${toFullUrl(DEFAULT_LOCALE, urlPath)}"/>`,
      );
    }
    html = html.replace('</head>', tags.join('') + '</head>');
    altPatched += 1;
  }

  if (html !== before) await writeFile(file, html);
}

// dumi's sitemap plugin writes each route's path verbatim (no trailing slash).
// Rewrite to match the URL nginx actually serves without a redirect, so every
// crawl of a sitemap URL lands directly instead of spending a hop on a 301.
const sitemapFile = join(DIST, 'sitemap.xml');
let sitemapXml = await readFile(sitemapFile, 'utf8');
const sitemapBefore = sitemapXml;
sitemapXml = sitemapXml.replace(/<loc>([^<]*)<\/loc>/g, (tag, url) =>
  url.endsWith('/') ? tag : `<loc>${url}/</loc>`,
);
if (sitemapXml !== sitemapBefore) await writeFile(sitemapFile, sitemapXml);

console.log(
  `postbuild-seo: lang on ${langPatched} file(s), canonical on ${canonicalPatched} file(s), hreflang on ${altPatched} file(s), sitemap trailing slashes ${sitemapXml === sitemapBefore ? 'unchanged' : 'added'}`,
);
