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
title: Generating Code with an LLM
order: 7
toc: content
description: Writing prompts to generate go-admin business code with an LLM — why simply asking a model to write it fails, the three elements a good prompt needs, and copy-paste templates for adding a module, complex business logic, tests, and migrations.
keywords: [AI code generation prompts, go-admin AI development, AGENTS.md, LLM writing golang, cursor prompts]
---

# Generating Code with an LLM

The previous sections covered the [code generator](/en-US/intro/advanced/tutorial0420) —
reads a table structure, produces code from a template, deterministic and
reproducible. This section covers the other route: generating code with an
LLM, suited to what the generator can't cover — business logic, reworking
existing code, filling in tests.

## Why Just Asking a Model Fails

Hand a model "write me a go-admin module" and the output usually isn't
directly usable. The problem isn't the model:

go-admin's public code spans years, and in the earlier ones every module
needed a hand-written Api and Service, each Api with at least seven functions.
That's mostly what a model has seen during training. The current repository
recommends the [Actions Pattern](/en-US/intro/advanced/advanced) for
single-table CRUD — a module has only model, dto and router files, no Api or
Service.

Both shapes run, so the model won't error and you won't notice right away. By
the time the two styles are mixed across the project, fixing it is expensive.

## Three Elements of an Effective Prompt

An effective prompt doesn't restate the conventions to the model — it **tells
it what to read**. All three elements matter:

### 1. Point at the Convention File

Both go-admin and go-admin-ui carry an `AGENTS.md` at their root, written
specifically for AI coding tools: layering boundaries, prerequisites for using
the generic Actions, naming rules, a few red lines. It deliberately avoids
restating stack versions (`go.mod` is authoritative) or commands (`Makefile`
is authoritative), to keep from drifting out of sync with the code.

Some tools read the root `AGENTS.md` automatically; if you're not sure yours
does, just ask it to read it in the prompt.

### 2. Point at a Compiled Reference

This line in `AGENTS.md` is the key one:

> The complete pattern for a standard CRUD module is in `app/demo/` — a
> compiled, tested, CI-covered reference. Where this document and it
> disagree, `app/demo/` wins.

Prose goes stale. **Code that compiles and that CI has run does not.**
`app/demo/` is only five files, cheap for a model to read, and it hands over
the directory layout, naming, DTO tag syntax, and route registration all at
once — more accurate than any written spec.

### 3. Draw the Boundary

Stating what not to do is more effective than only stating what to do. Models
tend to "give a little extra" — commonly adding apis and service files back
in, which shouldn't exist at all under the Actions pattern.

## Prompt Templates

### Adding a Standard Module

```text
Add a business module for the tb_article table.

Before starting, read:
- the root AGENTS.md
- every file under app/demo/ (the reference for the standard pattern; where
  it conflicts with AGENTS.md, it wins)

Requirements:
1. Use the generic Actions from common/actions — no hand-written Api or Service;
2. Create only model, dto and router files;
3. Generate() must return a copy, never in place;
4. When done, confirm the new package is imported with _ in cmd/api/.

Table structure:
CREATE TABLE `tb_article` (
  ...
);
```

Item 3 is called out on its own because it's the easiest mistake to make and
the hardest to notice: the generic Actions reuse the same instance across
concurrent requests, and `Generate()` returning in place lets data leak
between requests. It almost never shows up in solo testing — only in
production.

### Business Logic Beyond Single-Table CRUD

```text
This endpoint needs a cross-table transaction — the generic Actions don't fit.

Follow app/admin/apis/sys_post.go and its matching service to hand-write the
Handler and Service, keeping AGENTS.md's layering rules:
- Api does not touch Orm directly;
- Service does not touch gin.Context;
- always use e.Orm, never a global DB variable (multi-tenancy depends on the
  Orm carried in the request context).
```

### Reworking Existing Code

```text
Convert the app/xxx/ module from hand-written Api + Service to the Actions
pattern.

Read app/demo/ first to confirm the target shape, then rework file by file.
After the rework, the apis and service directories should be empty, and route
behaviour should be unchanged.
When done, list which files were deleted and which were added.
```

Asking the model to **list what was added and removed** means you can judge
whether the rework is thorough without diffing every file yourself.

### Filling In Tests

```text
Following the pattern in app/demo/service/dto/demo_product_test.go, add tests
for the xxx module's dto, with particular coverage of Generate() returning a
copy.
```

### Writing a Database Migration

```text
Write a migration for the tb_article table, placed under
cmd/migrate/migration/version/.

Notes:
- the first 13 characters of the filename are the timestamp version;
- it must go in version/, not version-local/ — the latter is in .gitignore
  and gets ignored on commit;
- an already-run migration file can't be modified; fix it with a new migration
  instead.
```

The directory point has to be spelled out: `version-local/` is gitignored, so
a migration placed there wrong never shows up in `git status`, never appears
in a PR, and the missing table is only discovered when someone else pulls the
code.

## What to Check Afterwards

A model's output needs a human to review it. The following map onto
`AGENTS.md`'s red lines, and are also where things actually go wrong most
often:

| Check | Failure if missed |
| --- | --- |
| Does `Generate()` return a copy? | Data leaks between concurrent requests |
| Is `e.Orm` used instead of a global DB? | Wrong database connection under multi-tenancy |
| Does `gin.Context` show up in Service? | Layering boundary violated |
| Is `TableName()` declared explicitly? | GORM's `SingularTable` config won't infer it |
| Which slice is the unauthenticated route registered in? | Should be `routerNoCheckRole`, see [Router Registration](/en-US/intro/advanced/router) |
| Which directory is the migration in? | A file in `version-local/` gets ignored |
| Does the permission key match the frontend? | Also needs to be seeded into `sys_menu` |

:::warning
Don't paste the real contents of `config/settings.yml` into an AI tool.
`database.source` carries the database credentials, and a leaked `jwt.secret`
can be used to forge a token for any user. When a model needs to understand the
config shape, paste a redacted snippet, or just point it at the
[Config Reference](/configure/settings).

:::

## Generator or LLM?

| | Code Generator | LLM Generation |
| --- | --- | --- |
| Fits | Standard CRUD | Business logic, reworking existing code, filling in tests |
| Result | Deterministic, reproducible | Needs human review |
| Prerequisite | Table matches the [Database Table Conventions](/en-US/intro/advanced/db) | Providing `AGENTS.md` and a reference |

Prefer the generator for standard modules — it's faster and needs no review.
Reach for an LLM where the generator doesn't cover.

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
