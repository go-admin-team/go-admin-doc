---
title: IDE 設定
order: 70
toc: menu
description: go-admin 開発における IDE 設定の提案です。GoLand と VSCode の選び方、インストール、基本設定について解説します。
keywords: [goland 設定, vscode go 開発, go 開発ツール, go ide おすすめ]
---

# IDE 設定

Go 開発でよく使われる IDE は、JetBrains の GoLand とマイクロソフトの VSCode です。GoLand は導入してすぐに使え、デバッグやリファクタリングのサポートもより充実しています。VSCode は無料で、公式の Go 拡張機能を入れれば十分に使えます。どちらでも問題ありません。ここでは両方について go-admin プロジェクトの設定方法を説明します。

## プロジェクトを開く

go-admin は標準的な Go Modules プロジェクトなので、**リポジトリのルートディレクトリを IDE で直接開くだけで大丈夫です**。`GOPATH` 配下に置く必要はありません。

開いたら、まず依存パッケージが揃っているか確認します。

```sh
$ go mod tidy
```

## GoLand

### 実行設定

`Run` → `Edit Configurations` から新しい `Go Build` を追加し、次の表のとおり入力します。

| 項目 | 値 |
| --- | --- |
| Run kind | `Package` または `Directory` |
| Package path / Directory | リポジトリのルートディレクトリ |
| Program arguments | `server -c config/settings.yml` |
| Working directory | **リポジトリのルートディレクトリ** |

`Working directory` は必ずリポジトリのルートディレクトリを指定してください。`-c config/settings.yml` は相対パスなので、作業ディレクトリが間違っていると「設定ファイルが見つからない」というエラーになります。

データマイグレーションも同様で、Program arguments を `migrate -c config/settings.yml` に変えるだけです。こうしておけばマイグレーションのコードにもブレークポイントを設定してデバッグできます。

### SQLite を使う場合

`driver: sqlite3` を設定している場合、ビルドタグを付けないと起動時に panic します。

`Go tool arguments` に `-tags sqlite3` を入力してください。

理由は[よくある質問](/ja-JP/guide/faq)を参照してください——タグを付けずにビルドすると sqlite3 ドライバを含まないバイナリになり、エラーメッセージにもビルドタグへの言及がないため、環境の問題と誤認しやすい点に注意が必要です。

## VSCode

### 必須の拡張機能

公式の [Go 拡張機能](https://marketplace.visualstudio.com/items?itemName=golang.Go) をインストールします。初めて `.go` ファイルを開いたときに、画面右下に `gopls`、`dlv` などのツールをインストールする案内が表示されるので、すべてインストールしてください。

### デバッグ設定

プロジェクトのルートディレクトリに `.vscode/launch.json` を作成します。

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "go-admin server",
      "type": "go",
      "request": "launch",
      "mode": "auto",
      "program": "${workspaceFolder}",
      "cwd": "${workspaceFolder}",
      "args": ["server", "-c", "config/settings.yml"]
    },
    {
      "name": "go-admin migrate",
      "type": "go",
      "request": "launch",
      "mode": "auto",
      "program": "${workspaceFolder}",
      "cwd": "${workspaceFolder}",
      "args": ["migrate", "-c", "config/settings.yml"]
    }
  ]
}
```

SQLite を使う場合は、該当する設定にビルドタグを追加します。

```json
      "buildFlags": "-tags=sqlite3"
```

## フロントエンドプロジェクト

go-admin-ui は VSCode で開き、`Vue - Official` 拡張機能（旧 Volar）のインストールをおすすめします。以前 Vetur をインストールしていた場合は無効化してください——両方を同時に有効にすると互いに干渉し、大量の誤検知の構文エラーが表示されます。

## トラブルシューティング

| 症状 | 原因 |
| --- | --- |
| 設定ファイルが見つからないと表示される | 実行設定の作業ディレクトリがリポジトリのルートになっていない |
| 起動時に sqlite 関連の panic が出る | `-tags sqlite3` ビルドタグが不足している |
| コードが大量に赤く表示されるがビルドは通る | 依存パッケージのダウンロードが完了していない。`go mod tidy` を実行後、IDE を再起動 |
| ブレークポイントが効かない | コンパイラの最適化が原因。Run ではなく Debug で起動しているか確認 |

:::warning
サポートについて：

このガイドを読んでいて分からないことがあれば、[Issue を作成](https://github.com/go-admin-team/go-admin/issues/new)してください。

:::
