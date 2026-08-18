// Rewrites the `lang` attribute in the pre-rendered HTML.
//
// The default theme declares `<html lang>` through react-helmet, but dumi's SSR
// does not apply helmet's html attributes to the template, so every page ships
// as `lang="en"` while the content is Chinese. Crawlers and screen readers read
// this attribute, so it has to be right in the static output.
//
// Locale is derived from the path: files under a locale base (e.g. /en-US/)
// take that locale, everything else is the default one. This keeps working when
// more locales are added.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const DEFAULT_LOCALE = 'zh-CN';
// Locale bases configured in .dumirc.ts; keep in sync when adding a locale.
const LOCALE_BASES = [];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name.endsWith('.html')) yield full;
  }
}

function localeFor(file) {
  const segments = relative(DIST, file).split(sep);
  return LOCALE_BASES.find((l) => segments[0] === l) ?? DEFAULT_LOCALE;
}

let patched = 0;
for await (const file of walk(DIST)) {
  const html = await readFile(file, 'utf8');
  const locale = localeFor(file);
  const next = html.replace(/<html([^>]*)\slang="[^"]*"/i, `<html$1 lang="${locale}"`);
  if (next !== html) {
    await writeFile(file, next);
    patched += 1;
  }
}
console.log(`fix-html-lang: patched ${patched} file(s)`);
