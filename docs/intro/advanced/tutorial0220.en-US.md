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
title: Frontend Config File
order: 2
toc: content
description: go-admin-ui frontend config — the .env environment-variable files and how to set the VUE_APP_BASE_API endpoint.
keywords: [go-admin-ui config, vue environment variables, VUE_APP_BASE_API config]
---

## Config File Overview

Each of the three environments has its own file: `.env.development` (local dev), `.env.production` (production build), `.env.staging` (staging). The two variables that matter are the same across all three:

```bash
# just a flag
ENV = 'development'

# base api
VUE_APP_BASE_API = 'http://localhost:8001'
```

- `ENV` just labels the current environment and generally doesn't need to change;
- `VUE_APP_BASE_API` is the backend service address — every frontend request gets built on top of it.

:::warning
**On a fresh clone, the frontend's default port doesn't match the backend's.** `.env.development` defaults to `localhost:8001`, while the backend's default port in `config/settings.yml` is `8000`. Running both at their defaults leaves the frontend unable to reach the backend — network errors on login and a captcha that won't load are both this same cause.

Just make the two agree: either change `.env.development` to `http://localhost:8000`, or change the backend's `application.port` to `8001`.

:::

## What to Put There When Deploying

- **Same-origin deployment** (recommended, see [Deployment](/en-US/guide/xmbs)) — leave it empty; requests go to the current domain and Nginx forwards them to the backend. The `.env.production` shipped in the repo is already set up this way (`VUE_APP_BASE_API = ''`);
- **Frontend and backend on different domains** — fill in the backend's full address, e.g. `https://api.example.com`.

## Common Issues

If the captcha won't load or requests error out, first check the address `VUE_APP_BASE_API` points to in the file for the current environment: is the backend actually listening there, and is that address reachable directly from the browser?

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
