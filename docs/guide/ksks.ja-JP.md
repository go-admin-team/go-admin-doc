---
title: クイックスタート
order: 20
toc: content
description: 5 分で go-admin を動かす手順です。フロントエンド・バックエンドのコードを取得し、MySQL データソースを設定し、migrate でデータベースを初期化し、バックエンドとフロントエンドを起動します。よくある起動エラーの対処法も含みます。
keywords: [go-admin インストール, go-admin クイックスタート, golang 管理画面 構築, gin vue プロジェクト起動]
---

go-admin はフロントエンドとバックエンドが分離しているため、2 つのプロジェクトをそれぞれ起動する必要があります。バックエンドの [go-admin](https://github.com/go-admin-team/go-admin) と、フロントエンドの [go-admin-ui](https://github.com/go-admin-team/go-admin-ui) です。この記事ではバックエンド、フロントエンドの順に説明します。

始める前に、全体の流れを確認しておきましょう。

| 段階 | 手順 | 説明 |
| --- | --- | --- |
| バックエンド | 環境準備 | Go 1.26 以上、Go Modules を有効化 |
| バックエンド | 取得とビルド | リポジトリを clone して `go build` を実行 |
| バックエンド | データソース設定 | `config/settings.yml` のデータベース接続を編集 |
| バックエンド | データベース作成 | 空のデータベースを作成（文字コードは utf8mb4） |
| バックエンド | データ初期化 | `migrate` コマンドでテーブル作成と初期データ投入 |
| バックエンド | サービス起動 | デフォルトでポート 8000 を待ち受け |
| フロントエンド | 環境準備 | Node 22 以上、pnpm 9 以上 |
| フロントエンド | 取得とインストール | リポジトリを clone して `pnpm install` |
| フロントエンド | 起動 | デフォルトでポート 9527 を待ち受け |

順調に進めば全体で約 20 分、そのほとんどは依存パッケージのダウンロードに費やされます。データベースは事前に準備しておいてください。MySQL は 8.0 以降を推奨します。

## 環境準備<Badge>go-admin</Badge>

:::info
Go のバージョンが 1.26 以上であること（リポジトリの `go.mod` の記述が優先されます）、また `GO111MODULE=on`（Go Modules モード）になっていることを確認してください。
:::

[Go の環境変数を設定する](/ja-JP/guide/env)

## API プロジェクトの取得<Badge>go-admin</Badge>

```bash
# 作業ディレクトリ
$ mkdir myproject && cd myproject

# clone
$ git clone https://github.com/go-admin-team/go-admin.git

# ビルド
$ cd ./go-admin
$ go mod tidy
$ go build
```

## データソースの設定<Badge>go-admin</Badge>

1. リポジトリに同梱されている設定ファイルをそのまま使い、`config/settings.yml` のデータソース設定を書き換える方法。
1. 別名でコピーし（例：`config/settings.dev.yml`）、起動時に `-c` オプションで指定する方法。複数の環境を切り分けたいときに便利です。

<img class="no-margin" src="https://doc-image.zhangwj.com/img/configv1.1.0.png"  height="400px" style="margin:0 auto;">

```yml
database:
  # データベースの種類：mysql、sqlite3、postgres
  driver: mysql
  # 接続文字列。ここでの mysql のデフォルト値には charset=utf8&parseTime=True&loc=Local&timeout=1000ms が含まれる
  source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
```

:::warning
**sqlite3 を使う場合はビルドタグが必須です**。付け忘れると起動時に panic します。

```bash
$ go build -tags sqlite3
# または直接実行
$ go run -tags sqlite3 . server -c config/settings.yml
```

原因は `common/database/open.go` に `//go:build !sqlite3` が付与されていることです。タグを付けずにビルドすると sqlite3 ドライバを含まないバイナリになり、実行時に空の関数を呼び出してクラッシュします。**エラーメッセージにビルドタグへの言及はない**ため、環境の問題と誤認しやすい点に注意してください。`Makefile` の `build-sqlite` ターゲットはこのために用意されています。

MySQL と PostgreSQL ではこの問題は発生しません。
:::

:::warning
MySQL は 8.0 以上を推奨します。

それより古いバージョンでは `Error 1071: Specified key was too long; max key length is 1000 bytes` のようなエラーが発生することがあります。お使いのデータベースのバージョンに応じて対応してください。

:::

エラーの原因：

MySQL では単一カラムのインデックスを作成する際に長さの制限があり、`myisam` エンジンでは `1000 bytes`、`innodb` エンジンでは `767 bytes` までとなっています。

対処方法：

```sh
# 設定ファイルを編集
vim /etc/my.cnf

# [mysqld] の下に MySQL のデフォルトエンジン設定を追加
default-storage-engine=InnoDB

# サービスを再起動
service mysqld restart
```

マイグレーションで作成されたテーブルを削除してから、マイグレーションコマンドを再実行すれば成功します。

## データベースの作成

開発環境では、Docker でデータベースを作成することをおすすめします。

```
docker run --name mysql -p3306:3306 -d -e MARIADB_ROOT_PASSWORD=123456 mariadb:latest
```

アカウント `root` / パスワード `123456` でローカルのデータベースに接続できます。

```
mysql -h 127.0.0.1 -p123456 -e 'create database dbname default charset utf8'
```

:::info
作成するデータベースのデフォルト文字コードは utf8 にしてください。

:::

## データ初期化<Badge>go-admin</Badge>

プロジェクトはコマンドによるデータベーススキーマと基礎データの初期化に対応しています。`migrate` コマンドで簡単に初期化できます。

```bash
# 初期化
# macOS または Linux の場合
$ go run main.go migrate -c config/settings.yml

# Windows の場合
$ go run main.go  migrate -c config\settings.yml
```

:::info
リポジトリに同梱されている設定ファイルは `config/settings.yml` です。ローカルで複数環境を分離したい場合は、コピーを作成して `-c` オプションで指定してください。例えば開発環境用に `config/settings.dev.yml` と名付けます。
:::

## サービス起動<Badge>go-admin</Badge>

初期化が終わったら、いよいよプロジェクトを起動してみましょう。`./go-admin server` を実行します。

```bash
# サービス起動
# macOS または Linux の場合
$ go run main.go  server -c config/settings.yml

# Windows の場合
$ go run main.go  server -c config\settings.yml
```

以下のような出力が表示された場合は、データベースの設定を確認してください。

```bash
2020-07-31 16:09:41.989 [INFO] Logger init success!
2020-07-31 16:09:41.990 [INFO] mysql-drive.go:20: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
2020-07-31 16:09:44.350 [FATA] mysql-drive.go:23: mysql connect error : dial tcp 127.0.0.1:3306: connect: connection refused
```

下の画像のような出力になれば成功です。おめでとうございます！

<img src="https://doc-image.zhangwj.com/img/serversuccessv1.1.0.png"  height="400px" style="margin:0 auto;">

次はフロントエンドのプロジェクトを起動しましょう！

:::warning
ここから第 2 段階に入ります。

:::

## 環境の確認<Badge>go-admin-ui</Badge>

フロントエンドには Node 22 以上、pnpm 9 以上が必要です（`package.json` の `engines` フィールドの記述が優先されます）。

```bash
$ node -v
v22.14.0

$ pnpm -v
9.15.1
```

:::warning
このプロジェクトは依存管理に **pnpm** を使用しており、リポジトリには `pnpm-lock.yaml` がコミットされています。
npm や yarn でインストールするとこのロックファイルが無視され、CI と異なるバージョンの依存パッケージがインストールされる可能性があります。

pnpm が未インストールの場合：`npm install -g pnpm`、または Node 標準の
`corepack enable` を使用してください。
:::

[Node のインストールへ](/ja-JP/guide/vue-install)

続いて `go-admin` プロジェクトのディレクトリを出ます。`go-admin` と `go-admin-ui` の各プロジェクトルートは、同じ階層に並べて置くことをおすすめします。

```bash
$ ls
go-admin      go-admin-ui

# 親ディレクトリに戻る
$ cd ../
```

## View プロジェクトの取得<Badge>go-admin-ui</Badge>

そのまま `git clone` します。

```bash
# clone
$ git clone https://github.com/go-admin-team/go-admin-ui.git
```

出力内容：

```bash
$ git clone https://github.com/go-admin-team/go-admin-ui.git
Cloning into 'go-admin-ui'...
...
Receiving objects: 100% (584/584), 580.92 KiB | 16.00 KiB/s, done.
Resolving deltas: 100% (127/127), done.
```

> おめでとうございます！これで go-admin-ui のコード取得が完了しました。

## 依存パッケージのインストール<Badge>go-admin-ui</Badge>

```bash
$ cd go-admin-ui/

$ pnpm install

# ネットワークが遅い場合はミラーレジストリを指定
$ pnpm install --registry=https://registry.npmmirror.com
```

:::info
パッケージの復元には少し時間がかかります。しばらくお待ちください……

:::

次のような出力が表示されればインストール完了です。

```bash
Packages: +1653
Progress: resolved 1653, reused 1653, downloaded 0, added 1653, done

Done in 21.4s
```

## View の起動<Badge>go-admin-ui</Badge>

`pnpm dev` コマンドでプロジェクトを起動します。

```bash
# 開発サーバーを起動
$ pnpm dev
```

出力内容：

```bash
  VITE v8.2.1  ready in 722 ms

  ➜  Local:   http://localhost:9527/
  ➜  Network: use --host to expose
```

:::info
同一ネットワーク内の他の端末からアクセスしたい場合は `pnpm dev --host` を実行してください。
:::

:::info
これでプロジェクトは起動していますが、1 点注意してください。go-admin（バックエンド）も起動しているか確認しましょう。起動していないと、画面上にエラーが表示されます。

:::

## ビルドとデプロイ

`pnpm build:prod` でビルドを開始します。

```bash
# プロジェクトをビルド
$ pnpm build:prod

vite v8.2.1 building for production...
✓ built in 18.42s
```

ビルド成果物はデフォルトで `./dist` に生成されます。`tree` コマンドなどで確認してください（Windows の場合はこの手順は省略できます）。

テスト環境での検証：`./dist` をテスト環境にアップロードして動作確認します。

デプロイ：検証済みの `./dist` を最終環境または本番環境にアップロードします。

systemd・Docker・Nginx を使った本番デプロイの完全な手順は[デプロイ](/ja-JP/guide/xmbs)を参照してください。

## 起動成功の判断基準

すべての項目を満たして初めて正常に動作しているといえます。

1. バックエンドのコンソールに起動ログが出力され、`mysql connect error` のようなエラーがないこと；
2. ブラウザで <http://localhost:9527> にアクセスするとログイン画面が表示されること；
3. `admin` / `123456` でログインできること；
4. サイドメニューが正しく展開され、任意のページ（例えば「ユーザー管理」）を開くと一覧データが表示されること。

特に重要なのは 4 番目です。ログイン画面が見えるのはフロントエンドが起動しているというだけの証拠であり、**一覧データが表示されて初めて、フロントエンドとバックエンドが連携し、データベースの初期化も成功したことを意味します**。

## つまずいたらまずここを確認

| 症状 | まず確認すること |
| --- | --- |
| バックエンド起動時に `mysql connect error` が出る | 設定ファイルのアカウント・パスワード・データベース名・ポート番号、データベースが作成済みかどうか |
| 起動時に sqlite 関連の panic が出る | sqlite 使用時はビルドタグが必須：`go run -tags sqlite3 .` |
| ログイン画面は開くが、ログイン時にネットワークエラーが出る | バックエンドが起動しているか、フロントエンドの `.env.development` の API アドレスがバックエンドを指しているか |
| ログインは成功するがメニューが空 | `migrate` が正常に実行され、初期データが投入されているか |
| 画面は開くが一覧で権限エラーが出る | 現在のアカウントのロールに、対応するメニューと API の権限が割り当てられているか |
| フロントエンドの依存パッケージのインストールに失敗する | Node が 22 以上か。`node_modules` を削除して再インストール（`pnpm-lock.yaml` は削除しないこと） |

その他のエラーは[よくある質問](/ja-JP/guide/faq)を参照してください。それでも解決しない場合は、[サポート](/help)のページで Issue に記載すべき情報を確認してください。

:::warning
サポートについて：
このガイドを読んでいて分からないことがあれば、[Issue を作成](https://github.com/go-admin-team/go-admin/issues/new)してください。
:::
