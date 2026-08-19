---
title: Introduction
order: 10
nav:
  title: Guide
  order: 1
description: go-admin is an open-source admin framework built on Gin, GORM, Casbin and Vue 3, shipping with users, roles, menus, departments, dictionaries and scheduled jobs, and following RESTful conventions.
keywords: [what is go-admin, golang admin framework, gin gorm casbin, open source rbac system]
---

## Introduction

[go-admin](https://github.com/go-admin-team/go-admin) is an application framework for admin systems. The backend is built on Gin, GORM and Casbin; the frontend on Vue 3 and Element Plus, with Arco Design and Ant Design editions also available.

The project is split across two repositories: [go-admin](https://github.com/go-admin-team/go-admin) is the backend service, [go-admin-ui](https://github.com/go-admin-team/go-admin-ui) is the frontend. The framework provides a standardised layered structure and development flow, so a project stays legible as it grows.

The problem it solves is repeated groundwork. Authentication, permissions, and user/department management — the parts every admin system has to rebuild — are already in place, so a new project can start on business logic directly.

## When to Use It

go-admin targets **internal systems with a defined permission model** — admin consoles, operations platforms, business middle-ends — that need role separation and scoped data visibility.

A good fit if:

- you need RBAC role permissions with data visibility scoped to the org chart;
- you need to serve multiple tenants from one codebase;
- your schema is reasonably regular, with most functionality being standard CRUD that a code generator can produce;
- your team is small and wants to skip building auth, permissions and logging infrastructure from scratch.

Worth weighing carefully if:

- you're building a high-concurrency, consumer-facing service — the framework's focus is admin tooling, not high-throughput optimisation;
- you already have a mature permission system and account center — integration cost may outweigh the benefit.

## Features

- Ready to use out of the box
- Follows RESTful API conventions
- Built on the Gin web framework, with middleware for authentication, CORS, access logs and trace IDs
- RBAC access control through Casbin
- JWT authentication
- Swagger documentation via swaggo
- GORM-backed storage, extensible to several database engines
- Configuration mapped directly onto structs
- Code generator
- Form builder
- Unit tests (in progress)

## What's Included

1. **Users** — accounts that operate the system.
2. **Departments** — the organisational tree (company, department, team), which data scopes build on.
3. **Positions** — job titles held by users.
4. **Menus** — navigation, action permissions and button-level permission keys.
5. **Roles** — menu permissions per role, and the data scope a role is limited to.
6. **Dictionaries** — stable lookup data used across the system.
7. **Parameters** — runtime configuration values.
8. **Operation logs** — records of both normal operations and errors.
9. **Login logs** — sign-in records, including failed attempts.
10. **API documentation** — generated from the code.
11. **Code generation** — CRUD for a table, configured visually.
12. **Form builder** — page layouts assembled by drag and drop.
13. **Server monitoring** — basic information about the host.

## Live Demos

1. Element Plus (Vue 3): <https://vue.go-admin.pro> — sign in with `admin` / `123456`
2. Ant Design (go-admin-pro): <https://antd.go-admin.pro> — sign in with `admin` / `123456`

## Contributors

go-admin is built by its community. The full list of contributors is on [GitHub](https://github.com/go-admin-team/go-admin/graphs/contributors).

## Feedback

This site is published at <https://www.go-admin.pro> and its source lives in [go-admin-doc](https://github.com/go-admin-team/go-admin-doc), built with [dumi](https://d.umijs.org/). Corrections and pull requests are welcome.

go-admin is under active development. Issues and suggestions are best raised on [GitHub](https://github.com/go-admin-team/go-admin/issues).

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
