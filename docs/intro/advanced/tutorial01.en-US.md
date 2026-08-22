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
title: Backend Directory Structure
order: 1
toc: content
description: The go-admin backend directory layout — what cmd, app, common and config are each responsible for.
keywords: [go-admin directory structure, golang project layout, gin project layering]
---

An overview of the go-admin backend's directory structure:

```bash
.
├── app                  # business code, see below
├── cmd                  # command entry points: api / migrate / config / app / version
├── common               # shared code: middleware, common Actions, response helpers, etc.
├── config               # config files (settings.yml, etc.) and table-creation SQL
├── docs                 # Swagger-generated API docs — don't edit by hand
├── scripts              # deployment scripts, e.g. Dockerfile
├── static               # static assets and the upload directory
├── template              # templates used by the code generator
├── test                 # tests
├── AGENTS.md             # conventions written for AI coding tools and new contributors
├── Dockerfile / docker-compose.yml   # containerised deployment config
├── Makefile              # common build/run commands
├── main.go               # program entry point
├── go.mod / go.sum       # dependency declarations
└── restart.sh / stop.sh  # simple start/stop scripts
```

## The app Directory

All business code lives here, split into subdirectories by application, each organised into layers internally:

```bash
app
├── admin      # the built-in user/permission management module: users, roles, menus, departments, dictionaries, etc.
├── demo       # the reference implementation for the standard module shape, see below
├── jobs       # scheduled job examples
└── other      # shared endpoints, including file upload
```

Taking `admin` as an example, its internal structure is:

```bash
app/admin
├── apis              # the Api layer, only needed when going beyond single-table CRUD
│   └── ...
├── models            # the Model layer, GORM structs
├── router            # route registration
└── service
    └── dto           # DTO definitions
    └── ...           # the Service layer, only needed when going beyond single-table CRUD
```

:::info
**Don't modify `admin` directly when adding a new application** — use the `app` command to scaffold a new application directory instead, which keeps upgrading the framework painless later. See [Creating a Module with `app`](/en-US/intro/cmd/app).

:::

## app/demo: The Reference for the Standard Module Shape

`app/demo` is the complete, current example — **it compiles, has tests, and CI runs it**. A standard single-table CRUD module needs only three files:

```bash
app/demo
├── models/demo_product.go        # Model
├── service/dto/demo_product.go   # DTO
└── router/demo_product.go        # routing + all CRUD, built on the common Actions
```

**No apis/, no service/** — the common Actions already cover parameter binding, data-permission filtering, pagination and response formatting. See [Standard Module Development](/en-US/intro/advanced/standard-module) and the [Actions Pattern](/en-US/intro/advanced/advanced).

Only when business logic goes beyond single-table CRUD (cross-table transactions, external calls, complex validation) do you need to hand-write an Api and Service, at which point the `apis/` and `service/` directories come into play — follow the shape in `app/admin`.

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
