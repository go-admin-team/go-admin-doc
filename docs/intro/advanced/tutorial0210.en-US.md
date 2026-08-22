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
title: Frontend Directory Structure
order: 1
toc: content
description: The go-admin-ui frontend directory layout — what each directory under src is responsible for and how pages are organised.
keywords: [go-admin-ui directory structure, vue3 project structure, vue project organisation]
---

A look at go-admin-ui's directory structure:

```bash
.
├── index.html            # entry HTML
├── vite.config.mjs       # Vite config
├── package.json
├── pnpm-lock.yaml        # dependencies are managed with pnpm, see below
├── jsconfig.json
├── public                # static files, copied as-is into the build output
├── src
│   ├── main.js           # app entry point
│   ├── App.vue           # root component
│   ├── api               # API calls, organised by module
│   ├── components        # shared components
│   ├── directive         # custom directives, e.g. the v-permisaction permission directive
│   ├── icons              # icons
│   ├── layout             # overall layout
│   ├── mixins             # logic reused across scenarios like list pages (e.g. the crud mixin)
│   ├── router              # route config
│   ├── store                # state management (Vuex)
│   ├── styles                # global styles
│   ├── utils                  # utility functions, including the request wrapper
│   ├── vendor                  # local copies of third-party scripts
│   ├── views                    # pages
│   ├── permission.js             # route guard, handles login state and dynamic routes
│   └── settings.js                # global config values
├── .env.development
├── .env.production
└── .env.staging               # staging environment config
```

A few things that differ from backend conventions and are easy to mix up:

- **There's no `dist` directory** — it's the build output, not checked into version control, and only appears after running `pnpm build:prod`;
- Dependencies are managed with **pnpm** (see `pnpm-lock.yaml`), not npm or yarn — see [Node Environment](/en-US/guide/vue-install);
- `mixins/` is still actively used (e.g. the crud logic on list pages) — it's not legacy, and can be reused when adding new list pages.

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
