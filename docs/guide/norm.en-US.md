---
title: Conventions
order: 80
toc: content
description: go-admin coding conventions — package and file naming, import group ordering, function naming, and route/API naming, as the shared reference for team consistency.
keywords: [go coding style, golang naming conventions, go import grouping, project code conventions]
---

# Conventions

This page covers go-admin's directory structure and naming conventions. `AGENTS.md` in the repository root is the same set of conventions written for AI coding tools — the content matches; for actual coding, the compiled reference at `app/demo/` is authoritative, see [Standard Module Development](/intro/advanced/standard-module).

### Directories and File Names

### app

`app` holds the different applications, or larger application modules. For example, go-admin ships a built-in user/permission management module, so there's an `admin` folder under `app`.

### admin

`admin` refers to go-admin's built-in user/permission management module.

### apis

The `apis` directory holds API files directly, named as:

Format: `apis/{name}.go`

### models

The `models` directory holds database ORM model files directly, named as:

Format: `models/{name}.go`

### router

The `router` directory holds route files directly, named as:

Format: `router/{name}.go`

### service

The `service` directory holds business-logic files directly, named as:

Format: `service/{name}.go`

### service/dto

The `service/dto` directory holds the models used for API request/response payloads, named as:

Format: `service/dto/{name}.go`

### Name Example

```go
article_list.go
# the filename here is illustrative, not meaningful in itself — just an example of the format
```

## Code Conventions

### Import Grouping

Three groups:

1. Standard library;
2. External packages;
3. Project-internal packages.

Format: separate each group clearly — a blank line is used for this.

Example:

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
  "github.com/go-admin-team/go-admin-core/sdk/api"

  "go-admin/app/admin/models"
  "go-admin/app/admin/service"
)
```

### Function Names

Format: `{action}{description}`

Two parts:

> 1. First part — the action; `Get`
> 2. Second part — a description; `ArticleList`

Example:

```go
// GetArticleList fetches the article list
func GetArticleList(c *gin.Context) {
    ...
}
```

## Routing

### API

Format: `api/{version}/{module}/{name}`

Example: `api/v1/system/sys-user`

### View

Format: `{module}/{name}`

Example: `system/sys-user`

## Go Built-ins

### init

Don't reach for Go's built-in `init` function on your own — if execution order isn't handled carefully, it can cause subtle problems.

## System Configuration

### Menu Management

Business action names: `list`, `add`, `remove`, `edit`, `query`

#### Permission Keys

Use lowerCamelCase.

Format: `{module}/{name}/{action}`

Example: `admin/sysUser/list`

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
