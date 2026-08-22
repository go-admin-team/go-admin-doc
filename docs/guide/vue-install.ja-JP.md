---
title: Node 環境
order: 60
toc: content
description: go-admin-ui のフロントエンド開発環境の構築手順です。Node.js と pnpm のインストール、ミラーレジストリの設定について説明します。go-admin-ui は Node 22 以上、pnpm 9 以上が必要です。
keywords: [node インストール手順, pnpm インストール, vue3 開発環境, node バージョン要件]
---

:::warning
このセクションでは go-admin-ui に必要な Node.js と pnpm のインストールについて、フロントエンド環境を初めて設定する読者向けに説明します。

:::

すでに Node 環境が整っている場合は、[クイックスタート](/ja-JP/guide/ksks) に進んでください。

## Node.js と npm のインストール

### ダウンロード

公式ダウンロードページ [https://nodejs.org/en/download/](https://nodejs.org/en/download/) から、お使いの OS に合ったバージョンを選択してください。LTS 版のダウンロードをおすすめします。

:::warning
**go-admin-ui は Node 22 以上が必要です**（`package.json` の `engines` フィールドを参照）。
Node 14 / 16 / 18 / 20 はすでにサポートが終了しており、ビルドツールの Vite 8 もこれらのバージョンでは動作しません。
:::

<img src="https://doc-image.zhangwj.com/img/nodejs-down.png" alt="nodejs-down"  width="400px"/>

### インストール

ダウンロードしたインストーラーをダブルクリックし、次の手順で進めます。

<img src="https://doc-image.zhangwj.com/img/nodejs-step1.png" alt="nodejs-step1"  width="400px"/>

<img src="https://doc-image.zhangwj.com/img/nodejs-step2.png" alt="nodejs-step2"  width="400px"/>

<img src="https://doc-image.zhangwj.com/img/nodejs-step3.png" alt="nodejs-step3"  width="400px"/>

<img src="https://doc-image.zhangwj.com/img/nodejs-step4.png" alt="nodejs-step4"  width="400px"/>

<img src="https://doc-image.zhangwj.com/img/nodejs-step5.png" alt="nodejs-step5"  width="400px"/>

インストールが完了すると、`node` と `npm` は `/usr/local/bin/` にインストールされます（上の画像は少し古いバージョンのインストーラーのものです。表示や番号はダウンロードしたものと異なる場合がありますので、実際のインストール手順に従ってください）。

ここまでで `Node.js` と `npm` のインストールは完了です！

### 確認

`node.js` のバージョン情報を確認します。

```sh
$  node -v
v22.14.0
```

バージョン番号が `v22` 以上であれば、Node.js の環境は問題なく使用できます。

## pnpm のインストール

go-admin-ui は依存管理に pnpm を使用しており、リポジトリには `pnpm-lock.yaml` がコミットされています。
npm や yarn でインストールするとこのロックファイルが無視され、CI と異なるバージョンの依存パッケージがインストールされる可能性があります。

```sh
# 方法 1：npm 経由でインストール
$ npm install -g pnpm

# 方法 2：Node 標準の corepack を使用（追加のダウンロード不要）
$ corepack enable
```

確認：

```sh
$  pnpm -v
9.15.1
```

バージョンが `9` 以上であれば問題ありません。

:::warning
サポートについて：
このガイドを読んでいて分からないことがあれば、[Issue を作成](https://github.com/go-admin-team/go-admin/issues/new)してください。
:::
