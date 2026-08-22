---
nav:
  title: Development
  order: 2
  second:
    title: Advanced
    order: 1
group:
  title: Backend Basics
  order: 2
title: Starting the Backend
order: 3
toc: content
description: How to start the go-admin backend service and verify it started successfully.
keywords: [go-admin startup, gin service startup, golang backend running]
---

## Start the Service

Once the project is configured, run:

```bash
go run main.go server -c config/settings.yml
```

Seeing the service's startup log output means it worked.

## Verify

Visit <http://127.0.0.1:8000/info> in a browser — a `{"message":"ok"}` response means the service is up and handling requests. This is the most direct health check, and it doesn't depend on the database being configured correctly.

Visiting the root path <http://127.0.0.1:8000/> (only available outside `prod` mode) shows a welcome page that embeds this documentation site; visiting `/swagger/admin/index.html` shows the API docs. Neither route is registered when `application.mode: prod`, since they're development conveniences.

## Changing the Listen Address and Port

Open `config/settings.yml` — the relevant fields are `application.host` and `application.port`:

```yml
settings:
  application:
    # listen address; default 0.0.0.0 (all interfaces, reachable from other devices on the LAN)
    host: 0.0.0.0
    # listen port
    port: 8000
```

To listen on localhost only, change `host` to `127.0.0.1`; to serve on a different port, change `port`. A restart is needed for changes to take effect.

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
