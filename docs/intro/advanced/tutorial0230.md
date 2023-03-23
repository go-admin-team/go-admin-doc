---
nav: 开发
group:
  title: 前端基础
  order: 0
title: 服务启动
order: 3
toc: content
---

## 前端的启动

启动 go-admin-ui 项目。请运行下面的命令：

```bash
# 首先需要检查 node 版本，是否是 16.15.0
node -v
# 如果不是，需要安装 16.15.0 版本的 node

# 安装依赖 这里需要注意如果安装速度过慢 可以配置淘宝镜像
# 如果安装包出现错误
# 需要删除 yarn.lock 或者 package.json.lock 和 node_modules
# 删除后重新安装即可
npm install
# 如果报错或者使用
yarn install

# 启动项目
npm run dev
```

程序启动后，浏览器访问 <http://localhost:9527/>，你将会看到 `go-admin` 的登录页面。

