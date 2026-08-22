---
nav:
  title: Development
  order: 2
  second:
    title: Advanced
    order: 1
group:
  title: Advanced Capabilities
  order: 7
title: Air Hot Reload
order: 10
toc: content
description: Using Air for hot reload in go-admin — installation, configuration and the common settings, so the service rebuilds and restarts automatically on save.
keywords: [go air hot reload, golang hot restart, air configuration, go dev productivity]
---
## Air Hot Reload

Air is a live-reload tool for Go web applications in development. When you change and save your project, it automatically rebuilds and reloads the application. Air supports Windows, macOS and Linux.

Here's how to configure and use it:

### Installing Air

Install Air with:

```
go install github.com/air-verse/air@latest
```

### A Problem You Might Hit

***After installing, `air.exe` needs to be added to your PATH; if it still doesn't work, run `go build` to regenerate the `air.exe` file.***

### Creating the Config File

Create a `.air.toml` file in the project directory as Air's config file. Air's defaults look like this:

```
# main configuration
root = "."  # root directory
tmp_dir = "tmp"
build_dir = "tmp"
app_port = 8080
log_prefix = "[AIR]"
log_time_format = "2006-01-02 15:04:05"
log_output = "stdout"

# watch configuration
[[watcher]]
name = "all"
paths = ["."]

# run configuration
[run]
watcher = ["all"]
listener = "127.0.0.1"
port = 8080
env = []
args = []
```

### Config Fields

* `root`: root directory, defaults to the current directory
* `tmp_dir`: directory for the compiled binary, defaults to `./tmp`
* `build_dir`: directory for the compiled binary, defaults to `./tmp`
* `app_port`: the application's port, defaults to `8080`
* `log_prefix`: log prefix, defaults to `[AIR]`
* `log_time_format`: log timestamp format, defaults to `2006-01-02 15:04:05`
* `log_output`: where logs go, defaults to `stdout`
* `[[watcher]]`: configuration for watching file changes
  * `name`: name of this watcher config, defaults to `all`
  * `paths`: list of directories to watch, defaults to the current directory
* `[run]`: how the application runs
  * `watcher`: name of the watcher config to use, defaults to `all`
  * `listener`: IP address to listen on, defaults to `127.0.0.1`
  * `port`: the application's port, defaults to `8080`
  * `env`: environment variables for the running application, empty by default
  * `args`: arguments for the running application, empty by default

### Using Air

Once `.air.toml` is set up, start Air with:

air -c .air.toml

Seeing this in the console means Air started successfully:

✔ Watching ./ http server started on [::]:8080
✔ http server started on 127.0.0.1:8080

Now, when you change and save the application's code, Air automatically rebuilds and reloads it — refresh the browser to see the change.


:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
