---
title: Quick Start
order: 20
toc: content
description: Get go-admin running in five minutes — clone the backend and frontend, configure a MySQL data source, run migrate to initialise the database, start both services, and troubleshoot common startup errors.
keywords: [go-admin installation, go-admin quick start, golang admin panel setup, gin vue project startup]
---

go-admin is split into a backend and a frontend, started separately: the backend [go-admin](https://github.com/go-admin-team/go-admin) and the frontend [go-admin-ui](https://github.com/go-admin-team/go-admin-ui). This page covers the backend first, then the frontend.

Here's the overall flow before diving in:

| Stage | Step | Notes |
| --- | --- | --- |
| Backend | Prerequisites | Go 1.26+, Go Modules enabled |
| Backend | Clone and build | clone the repo, run `go build` |
| Backend | Configure the data source | edit the database connection in `config/settings.yml` |
| Backend | Create the database | an empty database, utf8mb4 charset |
| Backend | Initialise data | `migrate` creates tables and seeds initial data |
| Backend | Start the service | listens on port 8000 by default |
| Frontend | Prerequisites | Node 22+, pnpm 9+ |
| Frontend | Clone and install | clone the repo, run `pnpm install` |
| Frontend | Start | listens on port 9527 by default |

The whole thing takes about 20 minutes when it goes smoothly, most of it spent downloading dependencies. Have a database ready beforehand — MySQL 8.0 or later is recommended.

## Prerequisites<Badge>go-admin</Badge>

:::info
Go version >= 1.26 (whatever `go.mod` in the repository declares takes precedence), with `GO111MODULE=on` (Go Modules mode).
:::

[Configuring Go environment variables](/en-US/guide/env)

## Download the API Project<Badge>go-admin</Badge>

```bash
# working directory
$ mkdir myproject && cd myproject

# clone
$ git clone https://github.com/go-admin-team/go-admin.git

# build
$ cd ./go-admin
$ go mod tidy
$ go build
```

## Configure the Data Source<Badge>go-admin</Badge>

1. Use the repository's own config file directly — just edit the data source in `config/settings.yml`.
1. Or copy it under a different name (e.g. `config/settings.dev.yml`) and point to it at startup with `-c`, which makes it easy to keep multiple environments apart.

<img class="no-margin" src="https://doc-image.zhangwj.com/img/configv1.1.0.png"  height="400px" style="margin:0 auto;">

```yml
database:
  # database type: mysql, sqlite3, postgres
  driver: mysql
  # connection string; the mysql default shown here includes charset=utf8&parseTime=True&loc=Local&timeout=1000ms
  source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
```

:::warning
**Using sqlite3 requires a build tag**, or the program panics on startup:

```bash
$ go build -tags sqlite3
# or run directly
$ go run -tags sqlite3 . server -c config/settings.yml
```

The reason is that `common/database/open.go` carries `//go:build !sqlite3` — without the tag, the binary is compiled without the sqlite3 driver and crashes at runtime on a nil function. **The error message never mentions the build tag**, so it's easy to mistake for an environment problem. The `build-sqlite` target in the `Makefile` exists for exactly this.

MySQL and PostgreSQL are unaffected.
:::

:::warning
MySQL 8.0+ works best.
Older versions can hit errors like `Error 1071: Specified key was too long; max key length is 1000 bytes` — adjust according to your local database version.

:::

Why this happens:

MySQL limits the length of a single-column index. Under the `myisam` and `innodb` storage engines the limits are `1000 bytes` and `767 bytes` respectively.

Fix:

```sh
# edit the config file
vim /etc/my.cnf

# add MySQL's default engine setting under [mysqld]
default-storage-engine=InnoDB

# restart the service
service mysqld restart
```

Drop the tables that the migration already created, then run the migration again — it should succeed.

## Create the Database

For local development, creating the database with Docker is a convenient option:

```
docker run --name mysql -p3306:3306 -d -e MARIADB_ROOT_PASSWORD=123456 mariadb:latest
```

Then connect with user `root` / password `123456`:

```
mysql -h 127.0.0.1 -p123456 -e 'create database dbname default charset utf8'
```

:::info
The database's default charset needs to be utf8.

:::

## Initialise Data<Badge>go-admin</Badge>

The project supports initialising the database schema and seed data via a command — the `migrate` command handles both:

```bash
# initialise
# macOS or Linux
$ go run main.go migrate -c config/settings.yml

# Windows
$ go run main.go  migrate -c config\settings.yml
```

:::info
The repository's own config file is `config/settings.yml`. For local multi-environment isolation, copy it and point to the copy with `-c` — for example, `config/settings.dev.yml` for a development environment.
:::

## Start the Service<Badge>go-admin</Badge>

Once initialisation is done, it's time to start the project — try `./go-admin server`:

```bash
# start the service
# macOS or Linux
$ go run main.go  server -c config/settings.yml

# Windows
$ go run main.go  server -c config\settings.yml
```

If you see output like this, check your database configuration:

```bash
2020-07-31 16:09:41.989 [INFO] Logger init success!
2020-07-31 16:09:41.990 [INFO] mysql-drive.go:20: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
2020-07-31 16:09:44.350 [FATA] mysql-drive.go:23: mysql connect error : dial tcp 127.0.0.1:3306: connect: connection refused
```

Output like the image below means success — congratulations!

<img src="https://doc-image.zhangwj.com/img/serversuccessv1.1.0.png"  height="400px" style="margin:0 auto;">

Next up, start the frontend!

:::warning
This is where the second stage begins.

:::

## Verify the Environment<Badge>go-admin-ui</Badge>

The frontend requires Node 22+ and pnpm 9+ (whatever the `engines` field in `package.json` declares takes precedence):

```bash
$ node -v
v22.14.0

$ pnpm -v
9.15.1
```

:::warning
The project manages dependencies with **pnpm**, and `pnpm-lock.yaml` is committed to the repository.
Installing with npm or yarn ignores that lockfile and may pull dependency versions that don't match CI.

If pnpm isn't installed yet: `npm install -g pnpm`, or use Node's built-in
`corepack enable`.
:::

[Installing Node](/en-US/guide/vue-install)

Next, leave the `go-admin` project directory. We recommend keeping the `go-admin` and `go-admin-ui` project roots as siblings, in the same parent directory.

```bash
$ ls
go-admin      go-admin-ui

# back to the parent directory
$ cd ../
```

## Download the View Project<Badge>go-admin-ui</Badge>

Clone it directly:

```bash
# clone
$ git clone https://github.com/go-admin-team/go-admin-ui.git
```

Output:

```bash
$ git clone https://github.com/go-admin-team/go-admin-ui.git
Cloning into 'go-admin-ui'...
...
Receiving objects: 100% (584/584), 580.92 KiB | 16.00 KiB/s, done.
Resolving deltas: 100% (127/127), done.
```

> The go-admin-ui code is now downloaded.

## Install Dependencies<Badge>go-admin-ui</Badge>

```bash
$ cd go-admin-ui/

$ pnpm install

# if the default registry is slow, point at a mirror
$ pnpm install --registry=https://registry.npmmirror.com
```

:::info
Restoring the package set can take a little while — hang tight.

:::

Output like this means it installed successfully:

```bash
Packages: +1653
Progress: resolved 1653, reused 1653, downloaded 0, added 1653, done

Done in 21.4s
```

## Start the View<Badge>go-admin-ui</Badge>

Start the project with `pnpm dev`:

```bash
# start the dev server
$ pnpm dev
```

Output:

```bash
  VITE v8.2.1  ready in 722 ms

  ➜  Local:   http://localhost:9527/
  ➜  Network: use --host to expose
```

:::info
To let other devices on the LAN access it, run `pnpm dev --host`.
:::

:::info
The project is running now, but check one thing: is go-admin (the backend) also running? Otherwise the page will show errors.

:::

## Build and Deploy

Kick off the build with `pnpm build:prod`:

```bash
# build the project
$ pnpm build:prod

vite v8.2.1 building for production...
✓ built in 18.42s
```

The build output goes to `./dist` by default; inspect it with `tree` (Windows users can skip this step).

Test environment verification: upload `./dist` to a test environment and verify it there.

Deployment: upload the verified `./dist` to the final or production environment.

For the full production deployment path (systemd, Docker, Nginx configuration), see [Deployment](/en-US/guide/xmbs).

## What Counts as a Successful Start

Check off every item — all of them need to hold:

1. The backend console printed its startup log with no `mysql connect error`-style errors;
2. Visiting <http://localhost:9527> in a browser shows the login page;
3. Signing in with `admin` / `123456` works;
4. The sidebar expands normally, and opening any page (e.g. "User Management") shows list data.

Step 4 is the one that matters. Seeing the login page only proves the frontend is running; **seeing list data is what proves the frontend and backend are actually connected and the database was initialised correctly**.

## Stuck? Check These First

| Symptom | Check first |
| --- | --- |
| Backend fails immediately with `mysql connect error` | Username, password, database name and port in the config file; whether the database was actually created |
| Startup panics with something sqlite-related | sqlite requires the build tag: `go run -tags sqlite3 .` |
| Login page loads, but signing in gives a network error | Whether the backend is running; whether the frontend's `.env.development` API address points at it |
| Login succeeds but the menu is empty | Whether `migrate` ran successfully and seeded the initial data |
| Pages load but lists return permission errors | Whether the current account's role has the relevant menu and API permissions assigned |
| Frontend dependency install fails | Whether Node is 22 or later; delete `node_modules` and reinstall, but don't delete `pnpm-lock.yaml` |

More errors are covered in the [FAQ](/en-US/guide/faq); if you're still stuck, see [Getting Help](/help) for what to include in an issue.

:::warning
Where to get help:
If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).
:::
