---
title: Node Environment
order: 60
toc: content
description: Setting up the go-admin-ui frontend development environment — installing Node.js and pnpm, and pointing them at a faster mirror. go-admin-ui requires Node 22 or later and pnpm 9 or later.
keywords: [node installation guide, pnpm install, vue3 dev environment, node version requirement]
---

:::warning
This section covers installing the Node.js and pnpm that go-admin-ui needs, for readers setting up the frontend environment for the first time.

:::

Readers who already have Node set up can go straight to [Quick Start](/en-US/guide/ksks).

## Installing Node.js & npm

### Download

Official download page: [https://nodejs.org/en/download/](https://nodejs.org/en/download/) — pick the build for your OS; an LTS release is recommended.

:::warning
**go-admin-ui requires Node 22 or later** (see the `engines` field in `package.json`).
Node 14 / 16 / 18 / 20 have all reached end of life, and Vite 8, the build tool used here, doesn't run on them.
:::

<img src="https://doc-image.zhangwj.com/img/nodejs-down.png" alt="nodejs-down"  width="400px"/>

### Install

Double-click the downloaded installer and follow the steps:

<img src="https://doc-image.zhangwj.com/img/nodejs-step1.png" alt="nodejs-step1"  width="400px"/>

<img src="https://doc-image.zhangwj.com/img/nodejs-step2.png" alt="nodejs-step2"  width="400px"/>

<img src="https://doc-image.zhangwj.com/img/nodejs-step3.png" alt="nodejs-step3"  width="400px"/>

<img src="https://doc-image.zhangwj.com/img/nodejs-step4.png" alt="nodejs-step4"  width="400px"/>

<img src="https://doc-image.zhangwj.com/img/nodejs-step5.png" alt="nodejs-step5"  width="400px"/>

Once installed, `node` and `npm` land under `/usr/local/bin/` (the screenshots above are from an older installer; the UI and version number you see may differ — follow whatever your installer actually shows).

That's it — Node.js and npm are installed.

### Verify

Check the Node.js version:

```sh
$  node -v
v22.14.0
```

Anything `v22` or later means the Node.js environment is good to go.

## Installing pnpm

go-admin-ui manages dependencies with pnpm, and `pnpm-lock.yaml` is committed to the repository.
Installing with npm or yarn ignores that lockfile and may pull dependency versions that don't match CI.

```sh
# option 1: install via npm
$ npm install -g pnpm

# option 2: use Node's built-in corepack (no extra download needed)
$ corepack enable
```

Verify:

```sh
$  pnpm -v
9.15.1
```

Anything `9` or later is fine.

:::warning
Where to get help:
If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).
:::
