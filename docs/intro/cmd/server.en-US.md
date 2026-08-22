---
nav:
  title: Development
  order: 2
  second:
    title: Commands
    order: 2
title: The server Command
order: 50
toc: content
description: go-admin's server command starts the API service, including the -c flag for specifying a config file and -a for auto-registering routes into the sys_api table.
keywords: [go-admin server startup, go-admin startup flags, golang service start command]
---

## Starting the Service

go-admin provides the `server` command for starting an API project.

First, build the binary from the project root:

```sh
go build
```

Then run the `server` command to start the project:

## Config File

The config file is specified with `-c`.

`go-admin server` loads `config/settings.yml` by default.

Since different setups need different config files, a `-c` flag is provided so you can point at whichever one you need:

For example:

```sh
$ go-admin server -c config/settings.dev.yml # name the file however suits your setup, e.g. settings.dev.yml, settings.prod.yml
```

`go-admin` in the commands above is the binary name `go build` produces by default — swap in whatever your local build actually produced. On Windows that's typically suffixed with `.exe`:

```sh
$ go-admin.exe server
```

## Auto-Registering APIs

go-admin also provides an `-a` flag to make it easier to keep API records up to date:

```sh
# On startup, checks whether every route is recorded in the sys_api table, and adds any that are missing
# -a defaults to false and can usually be omitted
$ go-admin server -a
```

## Note

The above covers starting from a compiled binary. During development, you can also start the project directly with `go run main.go`:

For example:

```sh
$ go run main.go server
```

## Reference

Video walkthrough (recorded on the subscription edition; the steps apply to the open-source edition too):

[[go-admin-pro] Adding APIs the easy way (also applies to go-admin)](https://www.bilibili.com/video/BV1pN4y157wp?spm_id_from=333.999.0.0)
