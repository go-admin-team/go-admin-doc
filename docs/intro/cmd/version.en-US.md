---
nav:
  title: Development
  order: 2
  second:
    title: Commands
    order: 2
title: The version Command
order: 60
toc: content
description: go-admin's version command prints the binary's version number — useful for confirming what's actually deployed in production, and worth including when reporting an issue.
keywords: [go-admin version number, go-admin version, golang view version]
---

## Checking the Version

The `version` command prints the go-admin version number of the current binary — commonly used to confirm that what's running in production matches what's expected.

```sh
$ ./go-admin version
```

Sample output:

```
2.4.0
```

The command takes no additional flags; the value comes from the `Version` variable in `common/global/adm.go`.

## When to Use It

1. **Confirm the deployed version**: when something's misbehaving, check the running binary's version first — otherwise you may be comparing old behavior against new docs;
2. **When filing an issue**: include this command's output when reporting a problem on [go-admin issues](https://github.com/go-admin-team/go-admin/issues/new), so the issue can be pinned to the right version;
3. **After an upgrade**: run it once to confirm the new binary is actually the one running.

:::info
It also works when running from source:

```sh
$ go run main.go version
```

:::

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
