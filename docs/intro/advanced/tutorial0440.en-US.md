---
nav:
  title: Development
  order: 2
  second:
    title: Advanced
    order: 1
group:
  title: Code Generation
  order: 6
title: Binding APIs to the Menu
order: 4
toc: content
description: Registering the generated APIs in API management and binding them to the menu, in preparation for role authorization.
keywords: [go-admin api management, binding apis to a menu, sys_api registration]
---


## Binding the New APIs to the Menu

1. First, get the newly added APIs registered automatically into API
   management —

run this command directly:

```sh
$ go run main.go server -c config/settings.yml -a
```

`-a` is a new flag on the `server` command — a boolean switch, off by default
and on when passed, that checks and creates entries for every API the running
program exposes.

:::warning
`-a` is a boolean switch: writing `-a true` or `-a false` is not valid usage.
`true` / `false` won't be read as the flag's value — they'll be treated as an
extra positional argument. To turn it off, just omit the flag.

:::

2. Go to "System Management → API Management" — the APIs just registered
   should be visible there. Edit their names, groups, etc. as needed so they
   line up with the menu, which makes them easier to identify during the next
   authorization step.
