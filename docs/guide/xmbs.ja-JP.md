---
title: デプロイ
order: 90
toc: content
description: go-admin を本番環境にデプロイする手順です。バックエンドバイナリのクロスコンパイル、systemd でのプロセス管理、Docker と docker-compose によるデプロイ、フロントエンドのビルドとアップロード、Nginx リバースプロキシの設定、リリース前チェックリストについて解説します。
keywords: [go-admin デプロイ, golang プロジェクト nginx デプロイ, go 管理画面 リリース, systemd go サービス デプロイ, docker golang デプロイ]
---

## デプロイの概要

go-admin はフロントエンドとバックエンドが分離しているため、一通りのデプロイには 3 つの要素が含まれます。

| 構成要素 | 内容 | 説明 |
| ---------- | ---------------------------------------- | --------------------------------------- |
| バックエンドサービス | go-admin をビルドしたバイナリ、または Docker イメージ | デフォルトでポート `8000` を待ち受け |
| フロントエンドの静的ファイル | go-admin-ui のビルド成果物である `dist` ディレクトリ | Nginx で静的ファイルとして配信 |
| Nginx | リバースプロキシ | 外部からの統一エントリポイントとして、API リクエストをバックエンドへ転送 |

典型的なリクエストの流れ：

```
ブラウザ ──► Nginx ──┬─► /            静的ファイル（フロントエンドの dist）
                     └─► /api/v1/*    バックエンド 127.0.0.1:8000 へリバースプロキシ
```

## 1. バックエンドのデプロイ

### 1.1 ビルド

プロジェクトのルートディレクトリで実行します。

```sh
# リポジトリ同梱の Makefile を使用（CGO_ENABLED=0 go build -ldflags="-w -s" -o go-admin . と同等）
$ make build
```

デプロイ先とビルド環境の OS やアーキテクチャが異なる場合は、クロスコンパイルが必要です。

```sh
# macOS / Windows 上で Linux amd64 版をビルド
$ CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o go-admin .

# ARM サーバーへデプロイする場合
$ CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -ldflags="-w -s" -o go-admin .
```

:::info
`-ldflags="-w -s"` はデバッグ情報を取り除くためのもので、バイナリサイズを大きく削減できます。

SQLite を使う場合は CGO が必要なため `CGO_ENABLED=0` は設定できません。代わりに `make build-sqlite` を使用してください。

:::

### 1.2 設定ファイルの準備

バイナリと設定ファイルをサーバーにアップロードします。推奨するディレクトリ構成は次のとおりです。

```
/opt/go-admin/
├── go-admin              # バイナリファイル
├── config/
│   └── settings.yml      # 本番環境の設定
├── static/               # 静的リソース
└── temp/                 # ログなどの一時ファイル
```

本番環境の設定では、少なくとも次の項目を確認してください。

```yml
settings:
  application:
    # prod にすること：Swagger ルートを無効化し、dev モードでの認証コードスキップやトークン無期限化を避ける
    mode: prod
    host: 0.0.0.0
    port: 8000
  jwt:
    # 必ず変更すること。デフォルト値のままにしない
    secret: ランダムな文字列に置き換えてください
    timeout: 3600
  logger:
    # 本番環境では trace は避ける
    level: info
  database:
    driver: mysql
    source: 本番データベースの接続文字列
```

各設定項目の詳しい説明は[設定リファレンス](/configure/settings)を参照してください。

### 1.3 データベースの初期化

初回デプロイ時はデータマイグレーションを実行する必要があります。

```sh
$ ./go-admin migrate -c config/settings.yml
```

### 1.4 サービスの起動

`systemd` での管理をおすすめします。プロセスが終了しても自動的に再起動され、ログの確認もしやすくなります。

`/etc/systemd/system/go-admin.service` を新規作成します。

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
$ systemctl status go-admin      # 実行状態を確認
$ journalctl -u go-admin -f      # ログを追跡
```

:::warning
`WorkingDirectory` は必ずバイナリが置かれているディレクトリを指定してください。そうしないと `-c config/settings.yml` のような相対パスが見つからなくなります。

サービスを root ユーザーで実行しないでください。専用のシステムユーザーを作成することをおすすめします。

:::

### 1.5 Docker デプロイ

リポジトリには `Dockerfile` と `docker-compose.yml` が用意されており、`make` コマンドで直接デプロイできます。

```sh
# イメージをビルド
$ make build-linux

# サービスを起動（内部で docker-compose up -d を実行）
$ make run

# サービスを停止
$ make stop
```

:::warning
`Dockerfile` には `COPY ./main /main` と書かれており、ルートディレクトリに `main` という名前のバイナリが存在することを前提としています。
一方 `make build` が生成するファイル名は `go-admin` です。

そのため `make build-linux` を実行する前に、まず `main` という名前でビルドしておく必要があります。

```sh
$ CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o main .
$ make build-linux
$ make run
```

:::

`docker-compose.yml` はデフォルトで 3 つのディレクトリをマウントするため、ホスト側であらかじめ用意しておく必要があります。

```yml
volumes:
  - ./config/:/go-admin-api/config/
  - ./static/:/go-admin-api/static/
  - ./temp/:/go-admin-api/temp/
```

## 2. フロントエンドのデプロイ

### 2.1 API アドレスの設定

go-admin-ui の `.env.production` を編集します。

```sh
# フロントエンドとバックエンドを同一ドメインでデプロイする場合（推奨）は空のままにし、リクエストは現在のドメインへ送られます
VUE_APP_BASE_API = ''

# フロントエンドとバックエンドを別ドメインでデプロイする場合は、バックエンドの完全なアドレスを入力します
# VUE_APP_BASE_API = 'https://api.example.com'
```

:::info
同一ドメインでのデプロイをおすすめします。Nginx を統一エントリポイントとし、フロントエンドの `/api/v1/*` リクエストをバックエンドへリバースプロキシすることで、CORS の対応が不要になり、バックエンドのアドレスがフロントエンドのビルド成果物に露出することもありません。

:::

### 2.2 ビルド

go-admin-ui は依存管理に pnpm を使用します。

```sh
$ pnpm install
$ pnpm build:prod
```

ビルド成果物は `dist` ディレクトリに生成されます。

### 2.3 アップロード

`dist` ディレクトリをサーバーの静的ファイル用ディレクトリにアップロードします。

```sh
$ rsync -avz --delete dist/ deploy@your-server:/opt/go-admin/dist/
```

:::warning
スクリプト内にサーバーのパスワードを平文で保存しないでください。

SSH 鍵認証の使用をおすすめします。また、デプロイ専用の制限付きユーザーを作成し、直接 root を使わないようにしてください。

:::

## 3. Nginx の設定

`/etc/nginx/conf.d/go-admin.conf` を新規作成し、ドメイン名とパスを実際の値に置き換えます。

```nginx
server {
  listen 80;
  server_name your-domain.com;

  # フロントエンドの静的ファイル
  location / {
    root /opt/go-admin/dist;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
  }

  # バックエンド API のリバースプロキシ
  location /api/ {
    proxy_set_header Host              $http_host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass http://127.0.0.1:8000;
  }

  # バックエンドの静的リソース（アップロードされたファイルなど）
  location /static/ {
    proxy_pass http://127.0.0.1:8000;
  }
}
```

システムで WebSocket を使用している場合は、該当パスにプロトコルアップグレード用のヘッダーを追加する必要があります。

```nginx
  location /ws {
    proxy_pass http://127.0.0.1:8000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade    $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
```

設定を確認して再読み込みします。

```sh
$ nginx -t          # 設定が正しいかテスト
$ nginx -s reload   # 設定を再読み込み
```

## 4. 更新とロールバック

更新時には前のバージョンのバイナリを残しておくと、問題が起きてもすぐに切り戻せます。

```sh
# 現在のバージョンをバックアップ
$ cp /opt/go-admin/go-admin /opt/go-admin/go-admin.bak

# 新しいバージョンをアップロード後、再起動
$ systemctl restart go-admin

# バージョンが想定どおりか確認
$ /opt/go-admin/go-admin version

# ロールバックが必要な場合
$ mv /opt/go-admin/go-admin.bak /opt/go-admin/go-admin
$ systemctl restart go-admin
```

フロントエンドの更新は、再ビルドして `dist` ディレクトリを上書きするだけで済み、バックエンドサービスの再起動は不要です。

## 5. リリース前チェックリスト

公開前に、次の項目をすべて確認してください。

- [ ] `application.mode` が `prod` に設定されている
- [ ] `jwt.secret` がランダムな文字列に置き換えられており、デフォルト値の `go-admin` のままではない
- [ ] `logger.level` が `trace` になっていない
- [ ] データベース接続文字列が本番データベースを指しており、`migrate` を実行済みである
- [ ] サービスが root ユーザーで実行されていない
- [ ] データベースのポートが外部に公開されていない
- [ ] HTTPS 証明書が設定されている

## 参考

- 動画チュートリアル：[【go-admin】go-admin の起動方法](https://www.bilibili.com/video/BV1z5411x7JG?spm_id_from=333.337.search-card.all.click)（中国語の動画で、収録時期もやや古いため、内容が本文と異なる場合は本文を優先してください）

:::warning
サポートについて：

このガイドを読んでいて分からないことがあれば、[Issue を作成](https://github.com/go-admin-team/go-admin/issues/new)してください。

:::
