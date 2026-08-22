---
nav:
  title: Development
  order: 2
  second:
    title: Advanced
    order: 1
group:
  title: Layered Development
  order: 5
title: Multi-Environment Config
toc: content
order: 6
description: Creating and using multiple go-admin config files — splitting settings across development, test and production, and selecting one with the -c flag.
keywords: [go-admin multi-environment config, golang config file management, dev test prod config isolation]
---

## Creating Config Files per Environment

go-admin's config file lives at `settings.yml` under `config` by default.

You can create a separate file per environment:

```sh
# a config file for development
settings.dev.yml

# a config file for production
settings.prod.yml

# a config file for testing
settings.test.yml
```

## Adding Custom Config Fields

Add an `extend` block under `settings`, and put whatever fields you need under it.

```yml
settings:
  extend: # usage notes for the extension block
    demo:
      name: data
```

Then, open `config/extend.go` and add:

```go
type Extend struct {
	Demo Demo   // configure the struct to match your config block
}

type Demo struct {
	name string
}
```

That's it.

## Reading a Custom Config Field

Import it wherever you need it:

```go
import (
    extConfig "go-admin/config"
)
```

Then use it directly:

```go
    fmt.Println("extConfig.ExtConfig.Demo.Name", extConfig.ExtConfig.Demo.Name)
```

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
