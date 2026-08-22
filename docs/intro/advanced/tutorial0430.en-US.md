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
title: One-Click Menu Generation
order: 3
toc: content
description: Creating the matching menu entry with one click after go-admin code generation, without manually keying in menu data.
keywords: [go-admin one-click menu, automatic admin menu generation]
---

## Generating the Menu

Back on the code generation list page, click `Generate Config` for the table —
the menu data is written straight into the `sys_menu` table, no need to enter
it manually in menu management.

The generated menu isn't assigned to any role by default, so it won't show up
yet — next, register the API, then handle role authorization together.

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
