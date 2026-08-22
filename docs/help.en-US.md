---
title: Getting Help
nav:
  title: Help
  order: 6
description: Where to start when you run into trouble with go-admin — a troubleshooting order to work through, how to file a good issue, and the community channels available.
keywords: [go-admin feedback, go-admin community, go-admin issue, golang admin panel help]
---

# Getting Help

## 1. Check the Docs First

Most problems already have an answer here. Working through these in order is usually the fastest path:

1. **[FAQ](/en-US/guide/faq)** — the high-frequency issues: CGO build failures, database connection problems, dependency install errors, and more;
2. **[Config Reference](/en-US/configure/settings)** — if a setting doesn't seem to take effect, Redis is configured but nothing changes, or the token lifetime looks wrong, check this page first to confirm the field is actually being read;
3. **[Quick Start](/en-US/guide/ksks)** — if a step in the startup flow fails, walk back through this page step by step;
4. **Search existing issues** — search the error text on [GitHub issues](https://github.com/go-admin-team/go-admin/issues?q=is%3Aissue); a lot of problems have already come up, including in closed issues, so it's worth checking those too.

## 2. Filing an Issue

If self-service doesn't turn up an answer, [open an issue](https://github.com/go-admin-team/go-admin/issues/new) — it's welcome.

Including the following speeds things up considerably; "it errors on startup" alone usually means several rounds of back-and-forth before anyone can start diagnosing:

```sh
# 1. Version number
$ ./go-admin version

# 2. Go version and OS
$ go version
```

Also worth including:

- **The full error output**, not a single truncated line. Wrap logs in a code block rather than a screenshot — a screenshot can't be searched, so the next person hitting the same problem won't find this issue;
- **Steps to reproduce**, and at which step it fails;
- **The relevant config**, with the database password, `jwt.secret`, and other sensitive fields removed first;
- **Database type and version** (MySQL / PostgreSQL / SQLite / SQL Server).

:::warning
Don't post an un-redacted config file in an issue, a chat, or anywhere public. `database.source` contains the database username and password, and a leaked `jwt.secret` can be used to forge a token for any user.

:::

## 3. Contributing

- **Found a mistake in the docs?** The source for this site is at [go-admin-doc](https://github.com/go-admin-team/go-admin-doc) — issues and PRs are both welcome;
- **Contributing code:** the development conventions live in the repository's root-level `AGENTS.md`; the standard shape for a module is in `app/demo/`;
- **Feature requests:** also go through issues — describing the use case helps more than describing the feature itself.

## 4. Community

This project's most active community channels — WeChat, a QQ group, and a Bilibili channel — are Chinese-language. If you're comfortable there, they're listed on the [Chinese version of this page](/help). Otherwise, [GitHub issues](https://github.com/go-admin-team/go-admin/issues) is the best place to ask in English — it's also searchable and stays useful to the next person with the same question.

## 5. Commercial Support

For more complete features and technical support, see [commercial licensing](/vip).
