import { Helmet, Outlet, useIntl } from 'dumi';
import React from 'react';

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

  return (
    <>
      <Helmet titleTemplate="%s - go-admin" defaultTitle="go-admin">
        <html lang={intl.locale} />
      </Helmet>
      <Outlet />
    </>
  );
};
