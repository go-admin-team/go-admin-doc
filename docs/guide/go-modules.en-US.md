---
title: Go Modules
order: 40
toc: content
description: Go Modules is Go's official dependency management approach. This page covers what GO111MODULE, GOPROXY and the other key settings do, and how their behaviour has changed across Go versions.
keywords: [what is go modules, GO111MODULE setting, goproxy configuration, go dependency management]
---

# Go Modules

Go Modules is Go's official dependency management approach, the default and only recommended one since Go 1.16. go-admin uses it to manage dependencies; here's what matters for day-to-day development.

## go.mod and go.sum

`go.mod` describes a project's dependencies, with three parts:

1. **Module name** — packages inside the project reference each other through it; go-admin's module name is `go-admin`.
2. **Go version** — declares the minimum Go version the project requires; go-admin currently requires 1.26.
3. **Dependency list** — direct and indirect dependencies (the latter marked `// indirect`).

`go.sum` records the checksum of every dependency, used to confirm the code you download matches what was first pulled in.

:::warning
`go.sum` **must be committed to version control**. It's what prevents a dependency from being tampered with — deleting it doesn't "clean up" the project, it just disables that check.

:::

## Common Commands

```sh
# initialise a module (only needed for a new project — go-admin already ships with go.mod)
$ go mod init module-name

# tidy dependencies: add what's missing, remove what's no longer used
$ go mod tidy

# download dependencies into the local module cache
$ go mod download

# see who pulled in a given package (useful when tracking down a dependency conflict)
$ go mod why -m package-name

# list every dependency and its version
$ go list -m all
```

`go mod tidy` is the one you'll reach for most: **run it after adding or removing an import**, and it updates `go.mod` and `go.sum` to match.

## Dependency Fetches Failing

If fetching modules directly is slow or times out, point at a mirror:

```sh
$ go env -w GOPROXY=https://goproxy.cn,direct
```

See [Environment Variables](/en-US/guide/env) for more.

For dependencies from a private repository, also declare `GOPRIVATE` so matching modules skip the proxy and checksum verification:

```sh
$ go env -w GOPRIVATE=git.yourcompany.com
```

## Debugging Against a Local Dependency

When you need to debug a library go-admin depends on, such as go-admin-core, `replace` can point at a local directory instead of requiring a release for every change:

```
replace (
    github.com/go-admin-team/go-admin-core => ../go-admin-core
)
```

:::warning
`replace` is for local debugging only — **remove it before committing**. Committing it leaves everyone else, and CI, unable to build, since that local path doesn't exist on their machines.

:::

## Upgrading Versions

```sh
# upgrade a single dependency to the latest version
$ go get -u package-name

# upgrade to a specific version
$ go get package-name@v1.2.3
```

Before upgrading a core dependency, it's worth checking the scope of the change first. go-admin and go-admin-core have a version correspondence — upgrading core on its own can introduce interface incompatibilities; check the version pinned in the repository's `go.mod`.

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
