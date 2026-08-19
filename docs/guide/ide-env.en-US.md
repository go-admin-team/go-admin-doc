---
title: IDE Setup
order: 70
toc: menu
description: IDE recommendations for go-admin development — choosing between GoLand and VSCode, and configuring each for the project.
keywords: [goland setup, vscode go development, go development tools, recommended go ide]
---

# IDE Setup

The two IDEs most commonly used for Go development are JetBrains' GoLand and Microsoft's VSCode. GoLand works well out of the box, with more complete debugging and refactoring support; VSCode is free and works fine once the official Go extension is installed. Either is a reasonable choice — this page covers configuring go-admin in both.

## Opening the Project

go-admin is a standard Go Modules project — **open the repository root directly in your IDE**, no need to place it under `GOPATH`.

Once it's open, make sure dependencies are resolved:

```sh
$ go mod tidy
```

## GoLand

### Configuring a Run Configuration

`Run` → `Edit Configurations` → add a new `Go Build`, and fill in:

| Field | Value |
| --- | --- |
| Run kind | `Package` or `Directory` |
| Package path / Directory | the repository root |
| Program arguments | `server -c config/settings.yml` |
| Working directory | **the repository root** |

`Working directory` must point at the repository root. `-c config/settings.yml` is a relative path — the wrong working directory means "config file not found".

Migrations work the same way — swap the program arguments for `migrate -c config/settings.yml`, which also lets you set breakpoints in migration code.

### Using SQLite

If configured with `driver: sqlite3`, a build tag is required or the program panics on startup:

Add `-tags sqlite3` under `Go tool arguments`.

See [FAQ](/en-US/guide/faq) for why — without the tag, the binary is compiled without the sqlite3 driver, and the error message never mentions the build tag, so it's easy to mistake for an environment problem.

## VSCode

### Required Extension

Install the official [Go extension](https://marketplace.visualstudio.com/items?itemName=golang.Go). The first time you open a `.go` file, it prompts to install `gopls`, `dlv` and a few other tools — install all of them.

### Configuring Debugging

Create `.vscode/launch.json` in the project root:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "go-admin server",
      "type": "go",
      "request": "launch",
      "mode": "auto",
      "program": "${workspaceFolder}",
      "cwd": "${workspaceFolder}",
      "args": ["server", "-c", "config/settings.yml"]
    },
    {
      "name": "go-admin migrate",
      "type": "go",
      "request": "launch",
      "mode": "auto",
      "program": "${workspaceFolder}",
      "cwd": "${workspaceFolder}",
      "args": ["migrate", "-c", "config/settings.yml"]
    }
  ]
}
```

For SQLite, add the build tag to the relevant configuration:

```json
      "buildFlags": "-tags=sqlite3"
```

## Frontend Project

Open go-admin-ui in VSCode with the `Vue - Official` extension installed (formerly Volar). If Vetur was installed previously, disable it — running both at once causes a flood of false syntax errors as they interfere with each other.

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| "config file not found" | The run configuration's working directory isn't the repository root |
| Startup panics with something sqlite-related | Missing the `-tags sqlite3` build tag |
| Lots of red squiggles but it still compiles fine | Dependencies haven't finished downloading — run `go mod tidy` and restart the IDE |
| Breakpoints don't hit | Usually a compiler-optimisation issue — confirm you launched via Debug, not Run |

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
