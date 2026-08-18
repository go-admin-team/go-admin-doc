---
title: 部署环境
order: 90
toc: content
description: go-admin 生产环境部署教程：交叉编译后端二进制、systemd 托管进程、Docker 与 docker-compose 部署、前端构建上传、Nginx 反向代理配置与上线检查清单。
keywords: [go-admin 部署, golang 项目部署 nginx, go 后台管理系统上线, systemd 部署 go 服务, docker 部署 golang]
---

## 部署概览

go-admin 前后端分离，一次完整部署包含三部分：

| 组成       | 内容                                     | 说明                                    |
| ---------- | ---------------------------------------- | --------------------------------------- |
| 后端服务   | go-admin 编译出的二进制，或其 Docker 镜像 | 默认监听 `8000` 端口                     |
| 前端静态页 | go-admin-ui 构建产物 `dist` 目录          | 交给 Nginx 作为静态文件托管              |
| Nginx      | 反向代理                                  | 对外统一入口，转发 API 请求到后端服务     |

典型的请求路径：

```
浏览器 ──► Nginx ──┬─► /            静态文件（前端 dist）
                   └─► /api/v1/*    反向代理到后端 127.0.0.1:8000
```

## 一、后端部署

### 1.1 编译

在项目根目录执行：

```sh
# 使用仓库自带的 Makefile（等价于 CGO_ENABLED=0 go build -ldflags="-w -s" -o go-admin .）
$ make build
```

若部署机与编译机的操作系统或架构不同，需要交叉编译：

```sh
# 在 macOS / Windows 上编译 Linux amd64 版本
$ CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o go-admin .

# 部署到 ARM 服务器
$ CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -ldflags="-w -s" -o go-admin .
```

:::info
`-ldflags="-w -s"` 用于去除调试信息，可以明显减小二进制体积。

使用 SQLite 时需要 CGO，不能设置 `CGO_ENABLED=0`，改用 `make build-sqlite`。

:::

### 1.2 准备配置文件

将二进制与配置文件上传到服务器，目录结构建议如下：

```
/opt/go-admin/
├── go-admin              # 二进制文件
├── config/
│   └── settings.yml      # 生产配置
├── static/               # 静态资源
└── temp/                 # 日志等临时文件
```

生产环境的配置至少要确认以下几项：

```yml
settings:
  application:
    # 必须设置为 prod：关闭 Swagger 路由，且避免 dev 模式跳过验证码、token 近乎不过期
    mode: prod
    host: 0.0.0.0
    port: 8000
  jwt:
    # 必须修改，不能沿用默认值
    secret: 请替换为随机字符串
    timeout: 3600
  logger:
    # 生产环境不建议使用 trace
    level: info
  database:
    driver: mysql
    source: 生产库连接串
```

各配置项的完整说明见 [配置参考](/configure/settings)。

### 1.3 初始化数据库

首次部署需要执行数据迁移：

```sh
$ ./go-admin migrate -c config/settings.yml
```

### 1.4 启动服务

推荐使用 `systemd` 托管，进程退出后可自动拉起，也便于查看日志：

新建 `/etc/systemd/system/go-admin.service`：

```ini
[Unit]
Description=go-admin api server
After=network.target mysql.service

[Service]
Type=simple
WorkingDirectory=/opt/go-admin
ExecStart=/opt/go-admin/go-admin server -c config/settings.yml
Restart=always
RestartSec=5s
User=goadmin

[Install]
WantedBy=multi-user.target
```

```sh
$ systemctl daemon-reload
$ systemctl enable --now go-admin
$ systemctl status go-admin      # 查看运行状态
$ journalctl -u go-admin -f      # 跟踪日志
```

:::warning
`WorkingDirectory` 必须指向二进制所在目录，否则 `-c config/settings.yml` 这类相对路径会找不到文件。

不要使用 root 用户运行服务，建议单独创建一个系统用户。

:::

### 1.5 Docker 部署

仓库中提供了 `Dockerfile` 与 `docker-compose.yml`，可直接用 `make` 命令部署：

```sh
# 构建镜像
$ make build-linux

# 启动服务（内部执行 docker-compose up -d）
$ make run

# 停止服务
$ make stop
```

:::warning
`Dockerfile` 中是 `COPY ./main /main`，要求根目录下存在名为 `main` 的二进制文件，
而 `make build` 产出的文件名为 `go-admin`。

因此在执行 `make build-linux` 之前，需要先编译出 `main`：

```sh
$ CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o main .
$ make build-linux
$ make run
```

:::

`docker-compose.yml` 默认挂载三个目录，宿主机上需要提前准备好：

```yml
volumes:
  - ./config/:/go-admin-api/config/
  - ./static/:/go-admin-api/static/
  - ./temp/:/go-admin-api/temp/
```

## 二、前端部署

### 2.1 配置接口地址

修改 go-admin-ui 的 `.env.production`：

```sh
# 前后端同域部署（推荐），留空即可，请求会发往当前域名
VUE_APP_BASE_API = ''

# 前后端分离在不同域名时，填写后端完整地址
# VUE_APP_BASE_API = 'https://api.example.com'
```

:::info
推荐同域部署：由 Nginx 统一入口，前端请求 `/api/v1/*` 被反代到后端，
既不需要处理跨域，也不会把后端地址暴露在前端产物里。

:::

### 2.2 构建

go-admin-ui 使用 pnpm 管理依赖：

```sh
$ pnpm install
$ pnpm build:prod
```

构建产物位于 `dist` 目录。

### 2.3 上传

将 `dist` 目录上传到服务器的静态文件目录：

```sh
$ rsync -avz --delete dist/ deploy@your-server:/opt/go-admin/dist/
```

:::warning
不要在脚本中明文存放服务器密码。

推荐使用 SSH 密钥登录，并为部署单独创建一个受限用户，避免直接使用 root。

:::

## 三、Nginx 配置

新建 `/etc/nginx/conf.d/go-admin.conf`，将其中的域名与路径替换为实际值：

```nginx
server {
  listen 80;
  server_name your-domain.com;

  # 前端静态文件
  location / {
    root /opt/go-admin/dist;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
  }

  # 后端 API 反向代理
  location /api/ {
    proxy_set_header Host              $http_host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass http://127.0.0.1:8000;
  }

  # 后端静态资源（上传的文件等）
  location /static/ {
    proxy_pass http://127.0.0.1:8000;
  }
}
```

若系统中使用了 WebSocket，需要为对应路径补充协议升级头：

```nginx
  location /ws {
    proxy_pass http://127.0.0.1:8000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade    $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
```

检查并重载配置：

```sh
$ nginx -t          # 测试配置是否正确
$ nginx -s reload   # 重载配置
```

## 四、更新与回滚

更新时保留上一个版本的二进制，出问题可以立即换回：

```sh
# 备份当前版本
$ cp /opt/go-admin/go-admin /opt/go-admin/go-admin.bak

# 上传新版本后重启
$ systemctl restart go-admin

# 确认版本是否符合预期
$ /opt/go-admin/go-admin version

# 如需回滚
$ mv /opt/go-admin/go-admin.bak /opt/go-admin/go-admin
$ systemctl restart go-admin
```

前端更新只需重新构建并覆盖 `dist` 目录，无需重启后端服务。

## 五、部署检查清单

上线前逐项确认：

- [ ] `application.mode` 已设置为 `prod`
- [ ] `jwt.secret` 已替换为随机字符串，未使用默认值 `go-admin`
- [ ] `logger.level` 不是 `trace`
- [ ] 数据库连接串指向生产库，且已执行 `migrate`
- [ ] 服务未以 root 用户运行
- [ ] 数据库端口未对公网开放
- [ ] 已配置 HTTPS 证书

## 参考

- 视频教程：[【go-admin】如何启动 go-admin](https://www.bilibili.com/video/BV1z5411x7JG?spm_id_from=333.337.search-card.all.click)（录制时间较早，操作步骤请以本文为准）

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
