---
title: Gin と Vue 3 で構築する中大規模管理画面スキャフォールド
hero:
  title: go-admin
  description: 土台となる部分をあらかじめ用意しておくことで、ビジネスロジックの実装からすぐに始められる管理画面スキャフォールドです
  actions:
    - text: はじめる
      link: /ja-JP/guide/ksks
    - text: GitHub
      link: https://github.com/go-admin-team/go-admin
features:
  - title: すぐに使える
    emoji: 🚀
    description: 数分の設定だけで開発を始められます。ユーザー管理・認証・権限周りはすでに用意されているため、プロダクトに必要な部分だけを書けば済みます。
  - title: 技術スタック
    emoji: 🔧
    description: Gin・Vue・React をベースに構築されており、Casbin による RBAC アクセス制御モデルを採用しています。
  - title: 複数のフロントエンド
    emoji: 🎨
    description: Element Plus 版のほか、React 向けの Ant Design Pro V5・V6、Vue 3 向けの Arco Design にも対応しています。
  - title: アクション単位の権限制御
    emoji: 🔐
    description: 個々の API エンドポイントからページ全体まで、権限をプロダクトの要件に合わせて細かく設計できます。
  - title: データ権限
    emoji: 🗄️
    description: 組織構造に基づいて行単位のアクセス制御が可能です——自分のデータのみ、所属部門のデータ、配下部門のデータといった単位で制限できます。
  - title: コード自動生成
    emoji: ⚙️
    description: テーブル定義から CRUD・ソート・エクスポート・権限設定まで自動生成し、定型的な作業の大部分をカバーします。
description: go-admin は Gin、Vue 3、Element Plus をベースにしたオープンソースの管理画面スキャフォールドです。RBAC 権限、データ権限、JWT 認証、コードジェネレーター、マルチテナントを標準搭載しています。
keywords: [golang 管理画面, gin vue admin, オープンソース 管理画面 フレームワーク, go rbac, 管理画面 スキャフォールド]
---

## フィードバック

本サイトは <https://www.go-admin.pro> で公開されており、ソースは [go-admin-doc](https://github.com/go-admin-team/go-admin-doc) にあります（[dumi](https://d.umijs.org/) を使用して構築）。修正提案や Pull Request を歓迎します。

go-admin は活発に開発が続けられています。Issue や提案は [GitHub](https://github.com/go-admin-team/go-admin/issues) にお寄せください。

:::warning
サポートについて：

このガイドを読んでいて分からないことがあれば、[Issue を作成](https://github.com/go-admin-team/go-admin/issues/new)してください。

:::
