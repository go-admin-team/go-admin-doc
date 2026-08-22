---
title: 環境変数
order: 50
toc: content
description: go-admin の開発に関わる Go の環境変数の説明です。GOPROXY によるミラー設定、GO111MODULE の新しいバージョンでのデフォルト挙動、Windows・macOS・Linux での設定方法と優先順位について解説します。
keywords: [go 環境変数 設定, GOPATH 設定, windows go 環境変数, goproxy 設定]
---

# 環境変数

Go の挙動はいくつかの環境変数によって制御されます。ここでは go-admin の開発に関係する主なものと、各 OS での設定方法を説明します。

:::info
Go 1.16 以降のバージョンを使用している場合（go-admin は 1.26 以上が必要です）、`GO111MODULE` はすでにデフォルトで `on` になっており、**通常は手動で設定する必要はありません**。
実際に設定が必要になるのは基本的に `GOPROXY` だけです——モジュールの直接取得は環境によって遅延やタイムアウトが発生しやすいためです。

:::

## 関連する環境変数

| 変数 | 役割 | 推奨値 |
| --- | --- | --- |
| `GOPROXY` | モジュールプロキシのアドレス。依存パッケージの取得が遅い・タイムアウトする問題を解決 | `https://goproxy.cn,direct` |
| `GO111MODULE` | Go Modules を有効にするかどうか | 設定不要（1.16 以降はデフォルトで `on`） |
| `GOPATH` | ワークスペースディレクトリ。モジュールモードではダウンロードした依存パッケージとバイナリの保存先としてのみ使用 | デフォルトのまま |
| `GOPRIVATE` | プライベートリポジトリのプレフィックス。該当するモジュールはプロキシを経由せず、検証も行わない | プライベートな依存パッケージがある場合に必要に応じて設定 |

`GOPROXY` の末尾にある `,direct` は、プロキシが 404 を返した場合に取得元へ直接フォールバックすることを意味します。基本的にはそのまま残しておくことをおすすめします。

## 現在の設定を確認する

設定の前後どちらでも、次のコマンドで実際に有効な値を確認できます。

```sh
$ go env GOPROXY GO111MODULE
https://goproxy.cn,direct
on
```

すべての設定を確認するには `go env` を実行します。

## macOS / Linux

`go env -w` での書き込みをおすすめします。Go 自身の設定ファイルに保存されるため、ターミナルを開き直しても有効なままで、シェルの設定を変更する必要もありません。

```sh
$ go env -w GOPROXY=https://goproxy.cn,direct
```

シェルの設定ファイルに書き込みたい場合（他のツールから読み取らせたい場合など）は、使用しているシェルに応じて該当ファイルに追記します。

```sh
# zsh（macOS のデフォルト）
$ echo 'export GOPROXY=https://goproxy.cn,direct' >> ~/.zshrc && source ~/.zshrc

# bash
$ echo 'export GOPROXY=https://goproxy.cn,direct' >> ~/.bashrc && source ~/.bashrc
```

:::warning
`go env -w` とシェルの `export` が両方存在する場合、**環境変数のほうが優先度が高く**、`go env -w` で書き込んだ値を上書きします。
設定が期待どおりに反映されない場合は、まず `go env GOPROXY` で実際にどちらの値が有効になっているか確認してください。

:::

## Windows

コマンドラインでの方法は上記と同じです。

```powershell
> go env -w GOPROXY=https://goproxy.cn,direct
```

GUI からも設定できます。「マイコンピュータ」を右クリックし、「プロパティ」を選択します。

<img src="https://doc-image.zhangwj.com/img/wodediannaoshuxing.png" width="400px" />

「システムの詳細設定」をクリックします。

<img src="https://doc-image.zhangwj.com/img/xitongshuxing.png" width="400px" />

「環境変数」をクリックします。

<img src="https://doc-image.zhangwj.com/img/huanjingbianliang1.png" width="400px" />

「新規」をクリックし、変数名に `GOPROXY`、変数値に `https://goproxy.cn,direct` を入力します。

<img src="https://doc-image.zhangwj.com/img/huanjingbianliang3.png" width="400px" />

順に「OK」をクリックして保存します。

<img src="https://doc-image.zhangwj.com/img/huanjingbianliang4.png" width="400px" />

設定完了後は**コマンドラインウィンドウを開き直す**必要があります。すでに開いているウィンドウには新しい値が反映されません。

:::warning
サポートについて：

このガイドを読んでいて分からないことがあれば、[Issue を作成](https://github.com/go-admin-team/go-admin/issues/new)してください。

:::
