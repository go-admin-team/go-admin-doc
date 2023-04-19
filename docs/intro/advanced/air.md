---
group:
  title: 高级使用
  order: 10
title: Air 热加载
order: 400
toc: content
---
## Air 热加载

Air 是一个开发环境下的 Go Web 应用程序自动重新加载工具。当你对你的项目进行更改并保存时，它会自动重新构建和重新加载应用程序。Air 支持 Windows、macOS 和 Linux。

以下是 Air 的配置及使用说明：

### 安装 Air

使用以下命令来安装 Air：

```
go get -u github.com/cosmtrek/air
```

### 可能遇到的问题

***安装以后需要把air.exe配置到环境变量,如果不生效,执行go build 重新生成air.exe文件***

### 创建配置文件

在项目目录下创建一个 `.air.toml` 文件作为 Air 的配置文件。Air 的默认配置如下：

```
# main configuration
root = "."  # 根目录
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

### 配置文件说明

* `root`: 根目录，默认为当前目录
* `tmp_dir`: 存放编译后的二进制文件的目录，默认为 `./tmp`
* `build_dir`: 存放编译后的二进制文件的目录，默认为 `./tmp`
* `app_port`: 应用程序的端口号，默认为 `8080`
* `log_prefix`: 日志前缀，默认为 `[AIR]`
* `log_time_format`: 日志时间格式，默认为 `2006-01-02 15:04:05`
* `log_output`: 日志输出方式，默认为 `stdout`
* `[[watcher]]`: 监听文件改动的配置
  * `name`: 监听配置的名称，默认为 `all`
  * `paths`: 监听的目录列表，默认为当前目录
* `[run]`: 应用程序运行配置
  * `watcher`: 监听文件改动的配置名称，默认为 `all`
  * `listener`: 监听的 IP 地址，默认为 `127.0.0.1`
  * `port`: 应用程序的端口号，默认为 `8080`
  * `env`: 运行应用程序的环境变量，默认为空
  * `args`: 运行应用程序的参数，默认为空

### 使用 Air

配置好 `.air.toml` 后，使用以下命令启动 Air：

air -c .air.toml

在控制台输出以下信息，说明 Air 启动成功：

✔ Watching ./ http server started on [::]:8080
✔ http server started on 127.0.0.1:8080

现在，当你对应用程序的代码进行更改并保存时，Air 会自动重新构建和重新加载应用程序，你可以在浏览器中刷新页面以查看更改。
