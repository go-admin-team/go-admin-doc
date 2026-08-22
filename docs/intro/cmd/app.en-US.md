---
nav:
  title: Development
  order: 2
  second:
    title: Commands
    order: 2
title: The app Command
order: 20
toc: content
description: go-admin's app command — create a new business module under the app directory and have it auto-registered at startup, keeping business code separate from framework code so upgrades stay easy.
keywords: [go-admin app command, go-admin create module, golang business module layout]
---

## Creating an app

To keep a project's structure and reasoning clear, and to make it easier to organize your own code, go-admin introduces the concept of an "app". After downloading the project, avoid changing the code inside the `admin` app — that keeps future version upgrades easy, and lets you focus purely on your own business logic. That's what the `app` command is for.

:::warning
Command renamed

As of 2.1.*, the `createapp` command was renamed to `app`, matching the subscription edition.
:::

Use the `app` command to create a new app. The example below creates one named `appname` — replace it with your own business name in practice.

```sh
$ ./go-admin app -n appname
```

This creates a new folder under the `app` directory of the go-admin project, ready for your business code. The module is also automatically registered into go-admin's startup sequence.

## Reference

Video walkthrough (recorded on the subscription edition; the steps apply to the open-source edition too):

[[go-admin-pro] The app command on the subscription edition (also applies to go-admin)](https://www.bilibili.com/video/BV1Wa411o7Zr?spm_id_from=333.999.0.0)
