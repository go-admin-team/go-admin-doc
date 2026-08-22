---
title: コーディング規約
order: 80
toc: content
description: go-admin のコーディング規約です。パッケージとファイルの命名、import のグループ分けの順序、関数の命名形式、ルートと API の命名規約について解説します。チームで開発スタイルを統一する際の基準になります。
keywords: [go コーディング規約, golang 命名規約, go import グループ分け, プロジェクト コード規約]
---

# コーディング規約

この記事は go-admin のディレクトリ構成と命名規約をまとめたものです。リポジトリのルートにある `AGENTS.md` は、同じ規約を AI コーディングツール向けに書いたもので、内容はここと一致しています。実際のコーディングでは、コンパイル可能な `app/demo/` を基準にしてください。詳しくは[標準モジュール開発](/intro/advanced/standard-module)を参照してください。

### ディレクトリとファイル名

### app

`app` ディレクトリには、それぞれのアプリケーションや大きめのアプリケーションモジュールを配置します。例えば `go-admin` にはユーザー権限管理モジュールが標準搭載されているため、`app` 配下に `admin` フォルダがあります。

### admin

`admin` は `go-admin` に標準搭載されているユーザー権限管理モジュールを指します。

### apis

`apis` ディレクトリには API ファイルを直接配置します。命名形式は次のとおりです。

形式：`apis/{name}.go`

### models

`models` ディレクトリにはデータベース ORM モデルファイルを直接配置します。命名形式は次のとおりです。

形式：`models/{name}.go`

### router

`router` ディレクトリにはルートファイルを直接配置します。命名形式は次のとおりです。

形式：`router/{name}.go`

### service

`service` ディレクトリにはビジネスロジックファイルを直接配置します。命名形式は次のとおりです。

形式：`service/{name}.go`

### service/dto

`service/dto` ディレクトリには、API のリクエスト受け取りやレスポンス出力に使うモデルファイルを配置します。命名形式は次のとおりです。

形式：`service/dto/{name}.go`

### 命名例

```go
article_list.go
# ファイル名の内容は例示であり、意味を持ちません。形式の参考としてください
```

## コードの規約

### import の分類

分類は次の 3 つです。

1. 標準ライブラリ；
2. 外部パッケージ；
3. プロジェクト内のパッケージ。

形式：それぞれのブロックを明確に区切ります。ここでは空行で区切ります。

例：

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
  "github.com/go-admin-team/go-admin-core/sdk/api"

  "go-admin/app/admin/models"
  "go-admin/app/admin/service"
)
```

### 関数名

形式：`{操作}{説明}`

2 つの部分に分かれます。

> 1. 前半部分——操作を表す。`Get`
> 2. 後半部分——補足説明。`ArticleList`

例：

```go
// GetArticleList 文章一覧を取得する
func GetArticleList(c *gin.Context) {
    ...
}
```

## ルーティング

### API

形式：`api/{version}/{module}/{name}`

例：`api/v1/system/sys-user`

### View

形式：`{module}/{name}`

例：`system/sys-user`

## Go の組み込み関数

### init

Go の組み込み関数 `init` を自分で使わないでください。実行順序の制御を誤ると、思わぬ問題が発生することがあります。

## システム設定

### メニュー管理

業務名：`list`、`add`、`remove`、`edit`、`query`

#### 権限標識

小文字始まりのキャメルケース（lowerCamelCase）を使用してください。

形式：`{module}/{name}/{業務名}`

例：`admin/sysUser/list`

:::warning
サポートについて：

このガイドを読んでいて分からないことがあれば、[Issue を作成](https://github.com/go-admin-team/go-admin/issues/new)してください。

:::
