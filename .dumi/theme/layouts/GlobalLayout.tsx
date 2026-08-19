import { Helmet, Outlet, useIntl } from 'dumi';
import React, { useEffect } from 'react';

/**
 * Wraps every route to supply two things the default theme leaves unset in the
 * pre-rendered HTML:
 *
 * - `titleTemplate`, so a page keeps its short frontmatter title in the sidebar
 *   while search results still carry the project name.
 * - `<html lang>`, which the umi template hardcodes to "en" even though the
 *   content is Chinese. Derived from the active locale so it stays correct once
 *   more locales are added.
 */
export default () => {
  const intl = useIntl();

  useEffect(() => {
    redirectToPreferredLocale(intl.locale);
  }, [intl.locale]);

  return (
    <>
      <Helmet titleTemplate="%s - go-admin" defaultTitle="go-admin">
        <html lang={intl.locale} />
      </Helmet>
      <Outlet />
    </>
  );
};

/**
 * One-shot redirect from the Chinese homepage to /en-US/ for a browser whose
 * preferred language is English — but only ever once per browser, and only
 * from the homepage. Deep links (e.g. a search result landing on /guide/faq)
 * are left alone: most pages have no English translation yet, and dumi has no
 * locale fallback, so redirecting there would land on a 404.
 *
 * This exists purely for direct human visitors. Search engines are told about
 * the English version through the hreflang alternates in postbuild-seo.mjs,
 * which is the correct channel for that and unaffected by this running or not.
 *
 * Adding ja-JP or zh-TW later: extend the two-letter check below and keep it
 * in sync with the `locales` list in .dumirc.ts.
 */
function redirectToPreferredLocale(currentLocale: string) {
  if (typeof window === 'undefined') return;
  if (currentLocale !== 'zh-CN') return;
  if (window.location.pathname !== '/') return;

  // Automated clients (Googlebot's renderer included) report navigator.webdriver.
  // Skip them — a JS redirect during crawling could read as this page moving,
  // undermining the hreflang tags that already tell search engines about /en-US/.
  if (navigator.webdriver) return;

  const STORAGE_KEY = 'go-admin-locale-redirect-done';
  if (window.localStorage.getItem(STORAGE_KEY)) return;
  window.localStorage.setItem(STORAGE_KEY, '1');

  if (navigator.language?.toLowerCase().startsWith('en')) {
    window.location.replace('/en-US/');
  }
}
