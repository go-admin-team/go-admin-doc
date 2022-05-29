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
  const excludedSuffix = isZhCN(props.location.pathname) ? '.md' : '.zh-CN.md';

  const fileName =
    String(props.location.pathname).replace('/zh-CN', '') + excludedSuffix;

  console.log(moduleName, excludedSuffix, fileName);

  return fileName;
}

function isZhCN(pathname: string) {
  return /-cn\/?$/.test(pathname);
}

export default ({ children, ...props }) => (
  <Layout {...props}>
    <>
      {children}
      <AvatarList
        repo="go-admin-doc"
        owner="go-admin-team"
        fileName={getModuleData(props)}
      />
    </>
  </Layout>
);
