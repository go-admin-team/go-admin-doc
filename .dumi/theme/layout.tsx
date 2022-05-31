import React from 'react';
import Layout from 'dumi-theme-default/es/layout';
import AvatarList from '@qixian.cs/github-contributors-list';

function getModuleData(props) {
  const { pathname } = props.location;
  const moduleName = /^\/?components/.test(pathname)
    ? 'components'
    : pathname
        .split('/')
        .filter((item) => item)
        .slice(0, 2)
        .join('/');
  const excludedSuffix = !isZhCN(props.location.pathname) ? '.md' : '.zh-CN.md';

  const fileName =
    String(props.location.pathname).replace('/zh-CN', '') + excludedSuffix;

  // if (moduleName.indexOf('guide') != -1) {
  //   return '/docs/guide/index.md';
  // }

  console.log(moduleName, excludedSuffix, fileName);

  return '/docs' + fileName;
}

function isZhCN(pathname: string) {
  return /-CN\/?$/.test(pathname);
}

export default ({ children, ...props }) => (
  <Layout {...props}>
    <>
      {children}
      <AvatarList
        repo="go-admin-doc"
        owner="go-admin-team"
        fileName={getModuleData(props)}
        style={{ marginTop: '40px' }}
      />
    </>
  </Layout>
);
