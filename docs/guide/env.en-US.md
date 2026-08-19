---
title: Environment Variables
order: 50
toc: content
description: Go environment variables relevant to go-admin development — configuring the GOPROXY mirror, GO111MODULE's default behaviour in recent Go versions, and how to set them on Windows, macOS and Linux with the precedence rules that apply.
keywords: [go environment variables, GOPATH setup, configure go env on windows, goproxy setup]
---

# Environment Variables

Go's behaviour is controlled by a handful of environment variables. This page covers the ones relevant to go-admin development and how to set them on each OS.

:::info
On Go 1.16 or later (go-admin requires 1.26+), `GO111MODULE` already defaults to `on` — **you usually don't need to set it manually**.
The one that actually needs configuring is typically `GOPROXY` — fetching modules directly from `proxy.golang.org` can be slow or unreachable on some networks, and a mirror such as `goproxy.cn` (which works globally, not just in mainland China) fixes that.

:::

## Relevant Environment Variables

| Variable | Purpose | Suggested value |
| --- | --- | --- |
| `GOPROXY` | Module proxy address, fixes slow or timed-out dependency fetches | `https://goproxy.cn,direct` |
| `GO111MODULE` | Whether Go Modules is enabled | Leave unset — defaults to `on` since 1.16 |
| `GOPATH` | Workspace directory; in module mode it only holds downloaded dependencies and binaries | Keep the default |
| `GOPRIVATE` | Private-repo prefixes; matching modules skip the proxy and checksum verification | Set as needed for private dependencies |

The trailing `,direct` in `GOPROXY` means the client falls back to fetching directly from the source when the proxy returns a 404 — keep it.

## Checking the Current Configuration

Before or after changing anything, confirm what's actually in effect with:

```sh
$ go env GOPROXY GO111MODULE
https://goproxy.cn,direct
on
```

`go env` on its own lists everything.

## macOS / Linux

`go env -w` is the recommended way to set it — it's saved to Go's own config file, survives a new terminal session, and doesn't require touching shell config:

```sh
$ go env -w GOPROXY=https://goproxy.cn,direct
```

To write it into shell config instead (for example, so other tools can read it), append to the file for whichever shell you use:

```sh
# zsh (macOS default)
$ echo 'export GOPROXY=https://goproxy.cn,direct' >> ~/.zshrc && source ~/.zshrc

# bash
$ echo 'export GOPROXY=https://goproxy.cn,direct' >> ~/.bashrc && source ~/.bashrc
```

:::warning
When both `go env -w` and a shell `export` are set, **the environment variable takes precedence** and overrides whatever `go env -w` wrote.
If a setting doesn't seem to take effect, run `go env GOPROXY` first to see which one actually won.

:::

## Windows

The command-line approach is the same:

```powershell
> go env -w GOPROXY=https://goproxy.cn,direct
```

It can also be set through the GUI. Right-click `This PC`, choose `Properties`;

<img src="https://doc-image.zhangwj.com/img/wodediannaoshuxing.png" width="400px" />

Click `Advanced system settings`;

<img src="https://doc-image.zhangwj.com/img/xitongshuxing.png" width="400px" />

Click `Environment Variables`;

<img src="https://doc-image.zhangwj.com/img/huanjingbianliang1.png" width="400px" />

Click `New`, enter variable name `GOPROXY` and value `https://goproxy.cn,direct`;

<img src="https://doc-image.zhangwj.com/img/huanjingbianliang3.png" width="400px" />

Click `OK` to save at each dialog.

<img src="https://doc-image.zhangwj.com/img/huanjingbianliang4.png" width="400px" />

Once set, **reopen the command-line window** for it to take effect — windows already open won't pick up the new value.

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
