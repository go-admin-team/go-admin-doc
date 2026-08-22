---
nav:
  title: Development
  order: 2
  second:
    title: Commands
    order: 2
title: The install Command
order: 100
toc: content
description: go-admin-pro's install command walks through project setup via a visual onboarding page. This command exists only in the subscription edition, not in the open-source one.
keywords: [go-admin install, go-admin install command, golang project initialization]
---

:::error
**This command exists only in go-admin-pro (the subscription edition).**

The open-source go-admin does not register an `install` command — running it will report "command not found". For the open-source edition's setup flow, see [Quick Start](/en-US/guide/ksks); database initialization uses the [migrate command](/en-US/intro/cmd/migrate).

:::

<br>

## Project Initialization

To reduce the amount of manual configuration, `go-admin-pro` provides an `install` command that initializes the project, generates the config file, and creates the database tables.

```sh
$ go run main.go install
```

This launches the project's visual onboarding page — just follow the prompts.

Sample screens:

![](https://doc-image.zhangwj.com/img/install01.png)
![](https://doc-image.zhangwj.com/img/install02.png)
![](https://doc-image.zhangwj.com/img/install03.png)
![](https://doc-image.zhangwj.com/img/install04.png)
![](https://doc-image.zhangwj.com/img/install05.png)

At this point, setup is complete.
