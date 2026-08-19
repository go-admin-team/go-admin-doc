---
title: FAQ
order: 100
toc: content
description: Troubleshooting common go-admin errors — CGO build failures on Windows, sqlite dependency issues, database connection failures, frontend dependency install errors — with concrete fixes for each.
keywords: [go-admin errors, go-admin faq, CGO build failure, golang admin panel troubleshooting]
---

## CGO Issues

:::error
CGO issues on Windows

Building on Windows can hit `CGO`-related errors:

```bash
E:\go-admin>go build
# github.com/mattn/go-sqlite3
cgo: exec /missing-cc: exec: "/missing-cc": file does not exist
```

or

```bash
D:\Code\go-admin>go build
# github.com/mattn/go-sqlite3
cgo: exec gcc: exec: "gcc": executable file not found in %PATH%
```

[How to fix cgo: exec gcc: ...](#githubcommattngo-sqlite3-cgo-exec-gcc-)

:::

## Error: requires at least one arg

If starting the project prints `Error: requires at least one arg`, at least one argument is required.

Run `./go-admin -h` to see the available commands.

Output looks like this:

<img src="https://doc-image.zhangwj.com/img/runv1.1.0noarg.png" width="400px" />

## macOS: gyp: No Xcode or CLT version detected!

> The problem

```bash
> fsevents@1.2.12 install /Users/zhangwenjian/Code/go-test/go-admin-ui/node_modules/fsevents
> node-gyp rebuild

No receipt for 'com.apple.pkg.CLTools_Executables' found at '/'.

No receipt for 'com.apple.pkg.DeveloperToolsCLILeo' found at '/'.

No receipt for 'com.apple.pkg.DeveloperToolsCLI' found at '/'.

gyp: No Xcode or CLT version detected!
gyp ERR! configure error
gyp ERR! stack Error: `gyp` failed with exit code: 1
gyp ERR! stack     at ChildProcess.onCpExit (/usr/local/lib/node_modules/npm/node_modules/node-gyp/lib/configure.js:345:16)
gyp ERR! stack     at ChildProcess.emit (events.js:198:13)
gyp ERR! stack     at Process.ChildProcess._handle.onexit (internal/child_process.js:248:12)
gyp ERR! System Darwin 19.4.0
gyp ERR! command "/usr/local/bin/node" "/usr/local/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
gyp ERR! cwd /Users/zhangwenjian/Code/go-test/go-admin-ui/node_modules/fsevents
gyp ERR! node -v v10.16.0
gyp ERR! node-gyp -v v3.8.0
gyp ERR! not ok
```

> The fix

```bash
sudo xcode-select --install
```

If it was installed before, reset it with:

:::success
This happens after a macOS upgrade strips the Xcode CLI tools — reinstalling them with the command above fixes it.

:::

```bash
sudo xcode-select --reset
```

---

## mysql connect error %v dial tcp 127.0.0.1:3306: connect: connection refused

> The problem

```bash
$ ./go-admin
2020/04/07 14:21:14 root:password@tcp(127.0.0.1:3306)/dbname
2020/04/07 14:21:14 mysql connect error %v dial tcp 127.0.0.1:3306: connect: connection refused
```

> The fix

Fix the `database` settings in the config file, located at `config/settings.yml`. The relevant part to change:

```bash
  database:
    # database type: mysql, sqlite3, postgres
    driver: mysql
    # connection string; the mysql default shown here includes charset=utf8&parseTime=True&loc=Local&timeout=1000ms
    source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
```

## el-tree's setCheckedKeys Throws an Error

> The problem

```bash
"TypeError: Cannot read property 'setCheckedKeys' of undefined"
```

> Why

The tree's data is fetched asynchronously; by the time it's assigned, the component hasn't finished rendering yet, so `$refs` doesn't have the instance to hand back.

> The fix

Call it inside `$nextTick`, after the DOM has actually updated:

```js
roleMenuTreeselect(roleId).then(response => {
  this.menuOptions = response.data.menus
  this.$nextTick(() => {
    this.$refs.menuTree.setCheckedKeys(checkedKeys)
  })
})
```

The full version is in `src/views/admin/sys-role/index.vue`.

## "Sorry, you don't have access to this API, please contact your administrator"

> The problem

<img src="https://doc-image.zhangwj.com/img/noauthapi.png" width="400px" />

> The fix

<img src="https://doc-image.zhangwj.com/img/noauthapi_log.png" width="400px" />

Use this log output to work out what permission is missing and configure accordingly.

## github.com/mattn/go-sqlite3 cgo: exec gcc: \***\*\*\*\*\***

> The problem

This shows up on Windows:

```bash
E:\go-admin>go build
# github.com/mattn/go-sqlite3
cgo: exec /missing-cc: exec: "/missing-cc": file does not exist
```

or

```bash
D:\Code\go-admin>go build
# github.com/mattn/go-sqlite3
cgo: exec gcc: exec: "gcc": executable file not found in %PATH%
```

> The fix

Download the archive matching your system version:

https://sourceforge.net/projects/mingw-w64/files/mingw-w64/

:::info
⚠️ Note

This was tested against `MinGW-W64 GCC-8.1.0`. If your version differs, download and configure the build matching your OS.

64-bit systems, download this build:

[x86_64-posix-seh](https://sourceforge.net/projects/mingw-w64/files/Toolchains%20targetting%20Win64/Personal%20Builds/mingw-builds/8.1.0/threads-posix/seh/x86_64-8.1.0-release-posix-seh-rt_v6-rev0.7z)

32-bit systems, download this build:

[x86_64-win32-seh](https://sourceforge.net/projects/mingw-w64/files/Toolchains%20targetting%20Win64/Personal%20Builds/mingw-builds/8.1.0/threads-win32/seh/x86_64-8.1.0-release-win32-seh-rt_v6-rev0.7z)

:::

<img src="https://doc-image.zhangwj.com/img/minigw.png" width="400px" />

Extract the archive and add its `bin` directory to the `PATH` environment variable.

:::info
When setting the Windows environment variable, the `bin` directory's path must not contain spaces.

:::
For example, a path like `C:/go go/bin` won't work.

For example, `C:/go_go/bin` ✔️ works fine.

## Configured Redis, but It's Still Using Memory

The current version's cache and queue **only have an in-memory implementation**. `config/settings.yml` keeps a commented-out `redis` example, but this version of core's `Cache` struct has only a `memory` field — `Setup()` unconditionally returns the memory cache. Even with the Redis block uncommented and filled in correctly, the program still uses memory, with no error at all — a wrong Redis password won't stop it from starting either.

The consequence is that **the cache isn't shared across instances** in a multi-instance deployment — features that depend on it, like captchas and tokens, end up inconsistent between instances. See [Config Reference](/configure/settings) and [issue #846](https://github.com/go-admin-team/go-admin/issues/846) for details.

## Token Never Expires / Login Doesn't Ask for a Captcha

Check `application.mode` in the config file.

Set to `dev`, login **skips captcha verification**, and the JWT lifetime is forced to 876,010 hours (about 100 years) — `jwt.timeout` has no effect in this mode. This is meant to make local development convenient; **production must be set to `prod`**.

See [Config Reference](/configure/settings) for the full effect of each value.

## Config Changes Aren't Taking Effect

Check, in order:

1. Whether `-c` at startup points at the file you're actually editing — without `-c`, `config/settings.yml` is read by default;
2. Whether that config item is actually read by the program at all. The `locker` block, for instance, has no corresponding struct field in the current version, so anything written there is simply never parsed;
3. Whether the service was restarted. Config is loaded at startup — a change needs a restart to take effect.

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
