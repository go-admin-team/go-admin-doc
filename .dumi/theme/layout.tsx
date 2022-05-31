import React from 'react';
import Layout from 'dumi-theme-default/es/layout';
import AvatarList from '@qixian.cs/github-contributors-list';
import { Avatar, Tooltip } from 'antd';

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
  console.log(props.location.pathname);
  if (props.location.pathname == '/guide') {
    return '/docs/guide/index.md';
  }
  if (props.location.pathname == '/zh-CN/guide') {
    return '/docs/guide/index.zh-CN.md';
  }

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
        renderItem={(item, loading) =>
          loading ? (
            <Avatar style={{ opacity: 0.3 }} />
          ) : (
            <Tooltip title={`${item.username}`} key={item.username}>
              <a
                href={`https://github.com/${item.username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Avatar src={item.url}>{item.username}</Avatar>
              </a>
            </Tooltip>
          )
        }
      />
    </>
  </Layout>
);
