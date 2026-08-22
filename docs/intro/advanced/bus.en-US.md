---
nav:
  title: Development
  order: 2
  second:
    title: Advanced
    order: 1
group:
  title: Development Patterns
  order: 4
title: Hand-Written Pattern
toc: content
order: 2
description: go-admin's hand-written development pattern — writing the Handler and Service yourself when business logic goes beyond single-table CRUD.
keywords: [go-admin hand-written pattern, gin handler writing, golang business layering]
---

# Hand-Written Pattern

:::info
go-admin has two development patterns, chosen by how complex the business logic is:

1. **[The Actions Pattern](/en-US/intro/advanced/advanced)** — the default choice for single-table CRUD. The five common
   Actions in `common/actions` already cover parameter binding, data-permission filtering, actor
   injection, pagination and error responses, so a module needs only three files — model, dto and
   router — with no apis or service to write.
2. **The Hand-Written Pattern** (this page) — for when business logic goes beyond
   single-table CRUD (cross-table transactions, external calls, complex validation), where you write
   the Handler and Service yourself.

A compiled, complete example lives in the repository's `app/demo/` directory — where this page and
that directory disagree, the directory is authoritative.

:::

First, a look at the structure — this is specific to the `app` directory:

```bash
.
└── admin
    ├── apis
    ├── models
    ├── router
    └── service
```

`admin`: think of it as one project.

`apis`: the project's API files.

`models`: the project's database-layer models.

`router`: the project's routes.

`service`: the project's business logic.

`service/dto`: the models for receiving and parsing the data behind the project's APIs.

With that out of the way, let's move on.

The walkthrough below uses real code from the project — operation logging, as an example.

The order is: models, service/dto, service, apis, router.

Each of these modules can be reviewed individually, in that order.

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
