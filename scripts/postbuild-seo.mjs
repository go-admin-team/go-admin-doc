// Post-build pass over the pre-rendered HTML for two things dumi does not emit.
//
// 1. `lang` on <html>. The default theme declares it through react-helmet, but
//    dumi's SSR does not apply helmet's html attributes to the template, so every
//    page ships as lang="en" whatever its locale. Crawlers and screen readers
//    read this attribute, so it has to be right in the static output.
//
// 2. hreflang alternates. Without them search engines treat the translations of
//    a page as competing duplicates rather than as versions of one document.

//
// Alternates are derived from the files that actually exist: a page only gets a
// hreflang pointing at a locale that really has that page, so a partially
// translated site never advertises a URL that 404s.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const HOSTNAME = 'https://www.go-admin.pro';
const DEFAULT_LOCALE = 'zh-CN';
// Non-default locale bases from .dumirc.ts; keep in sync when adding a locale.
// Kept in sync with the `locales` list in .dumirc.ts.
const LOCALE_BASES = ['en-US'];

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

/** "guide/ksks/index.html" -> "/guide/ksks" */
function toUrlPath(sharedPath) {
  const trimmed = sharedPath.replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '');
  return '/' + trimmed;
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

for (const file of files) {
  const { locale, sharedPath } = classify(file);
  let html = await readFile(file, 'utf8');
  const before = html;

  html = html.replace(/<html([^>]*)\slang="[^"]*"/i, `<html$1 lang="${locale}"`);
  if (html !== before) langPatched += 1;

  const available = localesByPath.get(sharedPath);
  // A page with no translation yet needs no alternates — a lone self-referencing
  // hreflang tells search engines nothing.
  if (available && available.size > 1 && !html.includes('hreflang=')) {
    const urlPath = toUrlPath(sharedPath);
    const link = (loc) => {
      const base = loc === DEFAULT_LOCALE ? '' : `/${loc}`;
      return `<link rel="alternate" hreflang="${loc}" href="${HOSTNAME}${base}${urlPath}"/>`;
    };
    const tags = [...available].sort().map(link);
    if (available.has(DEFAULT_LOCALE)) {
      tags.push(
        `<link rel="alternate" hreflang="x-default" href="${HOSTNAME}${urlPath}"/>`,
      );
    }
    html = html.replace('</head>', tags.join('') + '</head>');
    altPatched += 1;
  }

  if (html !== before) await writeFile(file, html);
}

console.log(
  `postbuild-seo: lang on ${langPatched} file(s), hreflang on ${altPatched} file(s)`,
);
