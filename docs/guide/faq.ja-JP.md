---
title: よくある質問
order: 100
toc: content
description: go-admin のよくあるトラブルの対処法です。Windows での CGO ビルド問題、sqlite の依存関係、データベース接続失敗、フロントエンドの依存パッケージインストールエラーなどについて、具体的な解決手順とともに解説します。
keywords: [go-admin エラー, go-admin よくある質問, CGO ビルド失敗, golang 管理画面 トラブルシューティング]
---

## CGO の問題

:::error
Windows での CGO の問題

Windows 環境でビルドすると、`CGO` 関連のエラーに遭遇することがあります。

```bash
E:\go-admin>go build
# github.com/mattn/go-sqlite3
cgo: exec /missing-cc: exec: "/missing-cc": file does not exist
```

または

```bash
D:\Code\go-admin>go build
# github.com/mattn/go-sqlite3
cgo: exec gcc: exec: "gcc": executable file not found in %PATH%
```

[cgo: exec gcc: ... の解決方法](#githubcommattngo-sqlite3-cgo-exec-gcc-)

:::

## Error: requires at least one arg

プロジェクトの起動時に `Error: requires at least one arg` と表示された場合、少なくとも 1 つの引数が必要という意味です。

`./go-admin -h` でヘルプを確認することもできます。

出力例は以下のとおりです。

<img src="https://doc-image.zhangwj.com/img/runv1.1.0noarg.png" width="400px" />

## macOS: gyp: No Xcode or CLT version detected!

> 問題の詳細

```bash
> fsevents@1.2.12 install /Users/zhangwenjian/Code/go-test/go-admin-ui/node_modules/fsevents
> node-gyp rebuild

No receipt for 'com.apple.pkg.CLTools_Executables' found at '/'.

No receipt for 'com.apple.pkg.DeveloperToolsCLILeo' found at '/'.

No receipt for 'com.apple.pkg.DeveloperToolsCLI' found at '/'.

gyp: No Xcode or CLT version detected!
gyp ERR! configure error
gyp ERR! stack Error: `gyp` failed with exit code: 1
gyp ERR! stack     at ChildProcess.onCpExit (/usr/local/lib/node_modules/npm/node_modules/node-gyp/lib/configure.js:345:16)
gyp ERR! stack     at ChildProcess.emit (events.js:198:13)
gyp ERR! stack     at Process.ChildProcess._handle.onexit (internal/child_process.js:248:12)
gyp ERR! System Darwin 19.4.0
gyp ERR! command "/usr/local/bin/node" "/usr/local/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
gyp ERR! cwd /Users/zhangwenjian/Code/go-test/go-admin-ui/node_modules/fsevents
gyp ERR! node -v v10.16.0
gyp ERR! node-gyp -v v3.8.0
gyp ERR! not ok
```

> 解決方法

```bash
sudo xcode-select --install
```

以前インストールしたことがある場合は、次のコマンドでリセットしてください。

:::success
これは macOS をアップグレードした際に Xcode の CLI ツールが失われるために発生します。上記のコマンドで再インストールすれば解決します。

:::

```bash
sudo xcode-select --reset
```

---

## mysql connect error %v dial tcp 127.0.0.1:3306: connect: connection refused

> 問題の詳細

```bash
$ ./go-admin
2020/04/07 14:21:14 root:password@tcp(127.0.0.1:3306)/dbname
2020/04/07 14:21:14 mysql connect error %v dial tcp 127.0.0.1:3306: connect: connection refused
```

> 解決方法

設定ファイルの `database` 設定を修正します。設定ファイルの場所は `config/settings.yml` です。修正が必要な箇所は次のとおりです。

```bash
  database:
    # データベースの種類：mysql、sqlite3、postgres
    driver: mysql
    # 接続文字列。ここでの mysql のデフォルト値には charset=utf8&parseTime=True&loc=Local&timeout=1000ms が含まれる
    source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
```

## el-tree の setCheckedKeys でエラーが出る

> 問題の詳細

```bash
"TypeError: Cannot read property 'setCheckedKeys' of undefined"
```

> 原因

ツリーのデータは非同期で取得されるため、値を代入した時点ではコンポーネントの描画がまだ完了しておらず、`$refs` からインスタンスを取得できません。

> 解決方法

`$nextTick` の中で呼び出し、DOM の更新が完了してから操作します。

```js
roleMenuTreeselect(roleId).then(response => {
  this.menuOptions = response.data.menus
  this.$nextTick(() => {
    this.$refs.menuTree.setCheckedKeys(checkedKeys)
  })
})
```

完全な実装は `src/views/admin/sys-role/index.vue` を参照してください。

## 「このAPIへのアクセス権限がありません。管理者にお問い合わせください」

> 問題の詳細

<img src="https://doc-image.zhangwj.com/img/noauthapi.png" width="400px" />

> 解決方法

<img src="https://doc-image.zhangwj.com/img/noauthapi_log.png" width="400px" />

このログを参考に、不足している権限を確認して設定してください。

## github.com/mattn/go-sqlite3 cgo: exec gcc: \***\*\*\*\*\***

> 問題の詳細

これは Windows 環境で発生します。

```bash
E:\go-admin>go build
# github.com/mattn/go-sqlite3
cgo: exec /missing-cc: exec: "/missing-cc": file does not exist
```

または

```bash
D:\Code\go-admin>go build
# github.com/mattn/go-sqlite3
cgo: exec gcc: exec: "gcc": executable file not found in %PATH%
```

> 解決方法

お使いの環境に合ったアーカイブをダウンロードしてください。

https://sourceforge.net/projects/mingw-w64/files/mingw-w64/

:::info
⚠️ 注意

これは `MinGW-W64 GCC-8.1.0` で確認しています。バージョンが異なる場合は、お使いの OS に合わせてダウンロード・設定してください。

64 ビット OS の場合、こちらをダウンロードしてください。

[x86_64-posix-seh](https://sourceforge.net/projects/mingw-w64/files/Toolchains%20targetting%20Win64/Personal%20Builds/mingw-builds/8.1.0/threads-posix/seh/x86_64-8.1.0-release-posix-seh-rt_v6-rev0.7z)

32 ビット OS の場合、こちらをダウンロードしてください。

[x86_64-win32-seh](https://sourceforge.net/projects/mingw-w64/files/Toolchains%20targetting%20Win64/Personal%20Builds/mingw-builds/8.1.0/threads-win32/seh/x86_64-8.1.0-release-win32-seh-rt_v6-rev0.7z)

:::

<img src="https://doc-image.zhangwj.com/img/minigw.png" width="400px" />

解凍したら、`bin` ディレクトリをシステムの環境変数 `PATH` に追加するだけです。

:::info
Windows で環境変数を設定する際、`bin` ディレクトリのパスの途中にスペースを含めないでください。

:::
例：`C:/go go/bin` のようなパスは正しく動作しません。

例：`C:/go_go/bin` ✔️ であれば問題ありません。

## Redis を設定したのに、サービスが起動しない

現在のバージョンではキャッシュとキューの両方が Redis に対応しています。設定方法は[キャッシュ](/intro/advanced/cache)と[キュー](/intro/advanced/queue)を参照してください。

設定してもサービスが起動しない場合、ほとんどは接続パラメータの問題です——`redis` の設定が誤っていると、以前のバージョンのようにメモリ実装へ黙って切り替わるのではなく（それは [issue #846](https://github.com/go-admin-team/go-admin/issues/846) に記録されていた古い問題で、すでに修正済みです）、サービスの起動そのものが失敗します。次の順に確認してください。

1. `addr` に到達できるか——ローカルから `redis-cli -h <addr> ping` を実行できるか；
2. `password` が正しいか；
3. `db` の番号が Redis インスタンスの `databases` 設定を超えていないか。

起動ログには具体的な接続エラーが出力されるので、それをもとに特定すれば、推測に頼る必要はありません。

## トークンの有効期限が切れない／ログインに認証コードが不要

設定ファイルの `application.mode` を確認してください。

`dev` に設定されている場合、ログイン時に**認証コードの検証がスキップされ**、JWT の有効期限は 876010 時間（約 100 年）に強制的に設定されます。この場合 `jwt.timeout` の設定は無効になります。これはローカル開発を便利にするためのものであり、**本番環境では必ず `prod` に変更してください**。

各設定値の詳しい影響については[設定リファレンス](/configure/settings)を参照してください。

## 設定ファイルを変更しても反映されない

次の順に確認してください。

1. 起動時の `-c` が、実際に変更しているファイルを指しているか——`-c` を指定しない場合はデフォルトで `config/settings.yml` が読み込まれます；
2. その設定項目が本当にプログラムに読み込まれているか。例えば `locker` 設定ブロックは現在のバージョンでは対応する構造体フィールドがなく、記述しても解析されません；
3. サービスを再起動したか。設定は起動時に読み込まれるため、変更後は再起動が必要です。

:::warning
サポートについて：

このガイドを読んでいて分からないことがあれば、[Issue を作成](https://github.com/go-admin-team/go-admin/issues/new)してください。

:::
