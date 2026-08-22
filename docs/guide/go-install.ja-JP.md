---
title: Go 環境
order: 30
toc: content
description: go-admin の Go 開発環境の構築手順です。Windows・macOS・Linux への Go のインストール、GOPATH とミラーの設定、インストール結果の確認方法を説明します。go-admin は Go 1.26 以上が必要です。
keywords: [go 環境インストール, golang インストール手順, go バージョン要件, goproxy ミラー設定]
---

## 環境のインストール

:::info
このセクションでは Go 開発環境のインストール方法を、初めて Go を設定する読者向けに説明します。IDE の設定については [IDE 設定](/ja-JP/guide/ide-env) を参照してください。

:::

すでに Go 環境が整っている場合は、[クイックスタート](/ja-JP/guide/ksks) に進んでください。

### 1. ダウンロード

公式ダウンロードページ [https://golang.org/dl/](https://golang.org/dl/) から、お使いの OS に合ったバージョンを選択してください。デフォルトでは最新バージョンがダウンロードされます。

<img src="https://doc-image.zhangwj.com/img/godown.png" width="400px" />

### 2. インストール

Go の公式サイトには各プラットフォーム向けのインストール手順が用意されています。[https://golang.org/doc/install](https://golang.org/doc/install) にアクセスし、案内に従ってインストールしてください。

:::info
どれをダウンロードすればよいか分からない場合は、下図の「1. Go Download」の箇所に適切なインストーラーが案内されています。

:::

<img src="https://doc-image.zhangwj.com/img/go-install.png" width="400px" />

ダウンロードしたインストーラーをダブルクリックし、次の手順で進めます。

<img src="https://doc-image.zhangwj.com/img/go-install-step1.png" width="400px" />

<img src="https://doc-image.zhangwj.com/img/go-install-step2.png" width="400px" />

<img src="https://doc-image.zhangwj.com/img/go-install-step3.png" width="400px" />

<img src="https://doc-image.zhangwj.com/img/go-install-step4.png" width="400px" />

ここまでで `Go` のインストールは完了です！

### 3. 確認

`Go` のバージョン情報を確認します。

```sh
$ go version
go version go1.26.5 darwin/arm64
```

このような表示が出れば、現在の環境で `go1.26.5 darwin/arm64` のインストールが成功したことを意味します（この例は macOS 上で実行しているため `darwin` と表示されています）。この情報は使用している OS によって異なり、Windows や Linux では表示内容が変わります。

:::warning
**go-admin は Go 1.26 以上が必要です**。リポジトリの `go.mod` にある `go` ディレクティブの記述が基準になります。
バージョンが古いと `go build` の段階でエラーになります。
:::

:::warning
サポートについて：
このガイドを読んでいて分からないことがあれば、[Issue を作成](https://github.com/go-admin-team/go-admin/issues/new)してください。
:::
