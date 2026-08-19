---
title: Deployment
order: 90
toc: content
description: Deploying go-admin to production — cross-compiling the backend binary, running it under systemd, Docker and docker-compose deployment, building and uploading the frontend, Nginx reverse-proxy configuration, and a pre-launch checklist.
keywords: [go-admin deployment, deploying a golang project with nginx, launching a go admin panel, deploying a go service with systemd, docker deployment for golang]
---

## Deployment Overview

go-admin splits backend and frontend, so a full deployment has three parts:

| Component | What it is | Notes |
| --- | --- | --- |
| Backend service | The compiled go-admin binary, or its Docker image | Listens on port `8000` by default |
| Frontend static assets | go-admin-ui's build output, the `dist` directory | Served by Nginx as static files |
| Nginx | Reverse proxy | The single public entry point; forwards API requests to the backend |

The typical request path:

```
Browser ──► Nginx ──┬─► /            static files (frontend dist)
                     └─► /api/v1/*    reverse-proxied to the backend at 127.0.0.1:8000
```

## Part 1: Backend Deployment

### 1.1 Build

From the project root:

```sh
# using the repository's Makefile (equivalent to CGO_ENABLED=0 go build -ldflags="-w -s" -o go-admin .)
$ make build
```

If the deployment machine's OS or architecture differs from the build machine's, cross-compile:

```sh
# building a Linux amd64 binary on macOS / Windows
$ CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o go-admin .

# deploying to an ARM server
$ CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -ldflags="-w -s" -o go-admin .
```

:::info
`-ldflags="-w -s"` strips debug information, which noticeably shrinks the binary.

SQLite requires CGO, so `CGO_ENABLED=0` can't be set when using it — use `make build-sqlite` instead.

:::

### 1.2 Prepare the Config File

Upload the binary and config file to the server. A suggested layout:

```
/opt/go-admin/
├── go-admin              # the binary
├── config/
│   └── settings.yml      # production config
├── static/               # static assets
└── temp/                 # logs and other temporary files
```

At minimum, confirm these settings for production:

```yml
settings:
  application:
    # must be prod: disables the Swagger route, and avoids dev mode's skipped captcha and near-permanent token
    mode: prod
    host: 0.0.0.0
    port: 8000
  jwt:
    # must be changed — don't keep the default
    secret: replace-with-a-random-string
    timeout: 3600
  logger:
    # trace isn't recommended in production
    level: info
  database:
    driver: mysql
    source: your-production-connection-string
```

See [Config Reference](/configure/settings) for every field.

### 1.3 Initialise the Database

The first deployment needs a migration run:

```sh
$ ./go-admin migrate -c config/settings.yml
```

### 1.4 Start the Service

Running it under `systemd` is recommended — it restarts the process if it dies, and makes logs easy to follow.

Create `/etc/systemd/system/go-admin.service`:

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
$ systemctl status go-admin      # check status
$ journalctl -u go-admin -f      # follow the logs
```

:::warning
`WorkingDirectory` must point at the directory the binary lives in, or relative paths like `-c config/settings.yml` won't resolve.

Don't run the service as root — create a dedicated system user for it.

:::

### 1.5 Docker Deployment

The repository ships a `Dockerfile` and `docker-compose.yml`, deployable directly via `make`:

```sh
# build the image
$ make build-linux

# start the service (runs docker-compose up -d internally)
$ make run

# stop the service
$ make stop
```

:::warning
The `Dockerfile` has `COPY ./main /main`, which expects a binary named `main` in the repo root — but `make build` produces a file named `go-admin`.

So `main` needs to be built before running `make build-linux`:

```sh
$ CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o main .
$ make build-linux
$ make run
```

:::

`docker-compose.yml` mounts three directories by default — have them ready on the host beforehand:

```yml
volumes:
  - ./config/:/go-admin-api/config/
  - ./static/:/go-admin-api/static/
  - ./temp/:/go-admin-api/temp/
```

## Part 2: Frontend Deployment

### 2.1 Configure the API Address

Edit go-admin-ui's `.env.production`:

```sh
# same-origin deployment (recommended) — leave it empty, requests go to the current domain
VUE_APP_BASE_API = ''

# when frontend and backend are on different domains, fill in the backend's full address
# VUE_APP_BASE_API = 'https://api.example.com'
```

:::info
Same-origin deployment is recommended: Nginx is the single entry point, and frontend requests to `/api/v1/*` get reverse-proxied to the backend — no CORS handling needed, and the backend's address is never exposed in the frontend build.

:::

### 2.2 Build

go-admin-ui manages dependencies with pnpm:

```sh
$ pnpm install
$ pnpm build:prod
```

The build output lands in the `dist` directory.

### 2.3 Upload

Upload `dist` to the server's static file directory:

```sh
$ rsync -avz --delete dist/ deploy@your-server:/opt/go-admin/dist/
```

:::warning
Don't store the server password in plain text in a script.

SSH key-based login is recommended, with a dedicated, restricted deploy user rather than root.

:::

## Part 3: Nginx Configuration

Create `/etc/nginx/conf.d/go-admin.conf`, replacing the domain and paths with your actual values:

```nginx
server {
  listen 80;
  server_name your-domain.com;

  # frontend static files
  location / {
    root /opt/go-admin/dist;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
  }

  # backend API reverse proxy
  location /api/ {
    proxy_set_header Host              $http_host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass http://127.0.0.1:8000;
  }

  # backend static assets (uploaded files, etc.)
  location /static/ {
    proxy_pass http://127.0.0.1:8000;
  }
}
```

If the system uses WebSocket, add the protocol upgrade headers for that path:

```nginx
  location /ws {
    proxy_pass http://127.0.0.1:8000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade    $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
```

Test and reload the config:

```sh
$ nginx -t          # verify the config is valid
$ nginx -s reload   # reload it
```

## Part 4: Updates and Rollbacks

Keep the previous binary around when updating, so you can switch back immediately if something goes wrong:

```sh
# back up the current version
$ cp /opt/go-admin/go-admin /opt/go-admin/go-admin.bak

# after uploading the new version, restart
$ systemctl restart go-admin

# confirm the running version is what you expect
$ /opt/go-admin/go-admin version

# to roll back
$ mv /opt/go-admin/go-admin.bak /opt/go-admin/go-admin
$ systemctl restart go-admin
```

Frontend updates only need a rebuild and an overwrite of the `dist` directory — no backend restart required.

## Part 5: Pre-Launch Checklist

Confirm every item before going live:

- [ ] `application.mode` is set to `prod`
- [ ] `jwt.secret` has been replaced with a random string, not left at the default `go-admin`
- [ ] `logger.level` is not `trace`
- [ ] The database connection string points at the production database, and `migrate` has been run
- [ ] The service isn't running as root
- [ ] The database port isn't exposed to the public internet
- [ ] HTTPS certificates are configured

## Reference

- Video walkthrough: [How to Start go-admin](https://www.bilibili.com/video/BV1z5411x7JG?spm_id_from=333.337.search-card.all.click) (in Chinese, and recorded some time ago — treat this page as authoritative where the two differ)

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
