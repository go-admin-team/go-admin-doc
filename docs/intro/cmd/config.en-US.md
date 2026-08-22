---
nav:
  title: Development
  order: 2
  second:
    title: Commands
    order: 2
title: The config Command
order: 30
toc: content
description: go-admin's config command prints the actual, parsed values from the config file — useful for tracking down why a setting doesn't seem to be taking effect. The output includes secrets and the database password, so handle it carefully.
keywords: [go-admin config command, go view config, config not taking effect troubleshooting]
---

## Viewing the Config

The `config` command reads the config file and prints the values it actually parsed, which is the fastest way to confirm whether a setting is taking effect as expected.

```sh
$ ./go-admin config -c config/settings.yml
```

Without `-c`, it reads `config/settings.yml` by default.

## Output

The command prints five config blocks as JSON, in order:

| Block | Contents |
| --- | --- |
| `application` | Run mode, listen address and port, read/write timeouts, the data-permission switch |
| `jwt` | Signing secret and token lifetime |
| `database` | Database driver and connection string; per-tenant configs under multi-tenancy |
| `gen` | The code generator's database name and frontend path |
| `logger` | Log path, level, and switches |

Sample output:

```json
application: {
   "ReadTimeout": 1,
   "WriterTimeout": 2,
   "Host": "0.0.0.0",
   "Port": 8000,
   "Name": "testApp",
   "Mode": "dev",
   "EnableDP": false
}
```

:::warning
**The output contains sensitive information.** The `jwt` block includes the signing secret, and the `database` block's connection string includes the database username and password — both printed in plain text.

When troubleshooting, do not paste the command's full output directly into an issue, a chat group, or anywhere public. If you need to share it, strip the secret and password first.

:::

## When to Use It

This command mainly answers "is this setting actually taking effect":

1. **Confirm which file was loaded** — multi-environment configs are easy to mix up; the printed values reflect exactly what was actually loaded;
2. **Confirm whether a field is being parsed at all** — a field written in the config file but absent from the output means the current version doesn't read it. The `locker` block, for example, has no corresponding struct field;
3. **Confirm the run mode** — before going live, check that `Mode` is `prod`, to avoid deploying with `dev` still set (which skips captcha verification on login and issues tokens that essentially never expire).

Note that the command only prints these five blocks — `cache`, `queue`, `ssl`, and others aren't included in its output. See [Config Reference](/en-US/configure/settings) for the complete field documentation.

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
