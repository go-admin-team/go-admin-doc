---
nav:
  title: Development
  order: 2
  second:
    title: Advanced
    order: 1
group:
  title: Frontend Basics
  order: 3
title: Starting the Frontend
order: 3
toc: content
description: Starting go-admin-ui — Node and pnpm version requirements, installing dependencies and starting the dev server.
keywords: [go-admin-ui startup, vue3 project startup, pnpm dev startup]
---

## Starting the Frontend

Start the go-admin-ui project by running:

```bash
# check the Node version — go-admin-ui requires Node 22 or later
node -v

# go-admin-ui manages dependencies with pnpm; if it isn't installed, run corepack enable first
pnpm -v

# install dependencies; if it's slow, point at a faster mirror:
# pnpm config set registry https://registry.npmmirror.com
# if install errors out, delete node_modules and reinstall (don't delete pnpm-lock.yaml)
pnpm install

# start the project
pnpm dev
```

Once it's running, visit <http://localhost:9527/> in a browser and you'll see go-admin's login page.
