---
title: 常见问题
order: 90
toc: content
---

## CGO 的问题

:::error
windows 下 CGO 的问题
请注意 您如果是 windows 环境您或许可能会遇到 `CGO` 的问题

```bash
E:\go-admin>go build
# github.com/mattn/go-sqlite3
cgo: exec /missing-cc: exec: "/missing-cc": file does not exist
```

or

```bash
D:\Code\go-admin>go build
# github.com/mattn/go-sqlite3
cgo: exec gcc: exec: "gcc": executable file not found in %PATH%
```

[如何解决 cgo: exec /missing-cc: exec: "/missing-cc": file does not exist](/guide/other/faq.html#_5-cgo-exec-missing-cc-exec-missing-cc-file-does-not-exist)

:::

## Error: requires at least one arg

项目启动时如果系统系统时输出内容告诉我们：Error: requires at least one arg ，至少有一个参数；

你也可以使用`./go-admin -h` 来查看帮助；

下图是输出内容：

<img src="https://raw.githubusercontent.com/wenjianzhang/image/master/img/runv1.1.0noarg.png" width="400px" />

输出内容告诉我们：Error: requires at least one arg ，至少有一个参数；

你也可以使用`./go-admin -h` 来查看帮助；

## Mac 环境中 gyp: No Xcode or CLT version detected!

> 问题详情

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

> 解决方案

```bash
sudo xcode-select --install
```

如果之前安装过，请使用一下命令重置

:::success
原因是 Mac 升级后，缺了 xcode 的 CLI 工具, 只要执行下面的命令来安装就可以了。

:::

```bash
sudo xcode-select --reset
```

---

## mysql connect error %v dial tcp 127.0.0.1:3306: connect: connection refused

> 问题详情

```bash
$ ./go-admin
2020/04/07 14:21:14 root:password@tcp(127.0.0.1:3306)/dbname
2020/04/07 14:21:14 mysql connect error %v dial tcp 127.0.0.1:3306: connect: connection refused
```

> 解决方案

修改配置文件中的 `mysql` 配置信息，配置文件的位置在 `config/settings.yml`，以下内容（只是配置文件中相关内容）是需要修改的配置内容

```bash
  database:
    # 数据库类型 mysql，sqlite3， postgres
    driver: mysql
    # 数据库连接字符串 mysql 缺省信息 charset=utf8&parseTime=True&loc=Local&timeout=1000ms
    source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
```

## 使用 element-ui 的 el-tree 组件 setCheckedKeys

> 问题详情

```bash
"TypeError: Cannot read property 'setCheckedKeys' of undefined"
```

> 解决方案

可参考项目中具体代码

## 对不起，您没有改接口访问权限，请联系管理员

> 问题详情

<img src="https://raw.githubusercontent.com/wenjianzhang/image/master/img/noauthapi.png" width="400px" />

> 解决方案

<img src="https://raw.githubusercontent.com/wenjianzhang/image/master/img/noauthapi_log.png" width="400px" />

可以根据这个日志，酌情进行配置

## github.com/mattn/go-sqlite3 cgo: exec gcc: \***\*\*\*\*\***

> 问题详情

在 windows 环境中会出现这个问题；

```bash
E:\go-admin>go build
# github.com/mattn/go-sqlite3
cgo: exec /missing-cc: exec: "/missing-cc": file does not exist
```

or

```bash
D:\Code\go-admin>go build
# github.com/mattn/go-sqlite3
cgo: exec gcc: exec: "gcc": executable file not found in %PATH%
```

> 解决方案

下载符合自己系统版本的压缩包

https://sourceforge.net/projects/mingw-w64/files/mingw-w64/

:::info
⚠️ 使用注意

当前是`MinGW-W64 GCC-8.1.0`版本，如果版本不匹配，可以根据对应的操作系统进行下载配置；

64 位操作系统，下载这个版本

[x86_64-posix-seh](https://sourceforge.net/projects/mingw-w64/files/Toolchains%20targetting%20Win64/Personal%20Builds/mingw-builds/8.1.0/threads-posix/seh/x86_64-8.1.0-release-posix-seh-rt_v6-rev0.7z)

32 位操作系统，下载这个版本

[x86_64-win32-seh](https://sourceforge.net/projects/mingw-w64/files/Toolchains%20targetting%20Win64/Personal%20Builds/mingw-builds/8.1.0/threads-win32/seh/x86_64-8.1.0-release-win32-seh-rt_v6-rev0.7z)

:::

<img src="https://raw.githubusercontent.com/wenjianzhang/image/master/img/minigw.png" width="400px" />

直接解压以后 , 把 bin 目录配置到 系统环境变量中的 PATH 变量中即可

:::info
windows 环境变量配置时，`bin`目录的路径中间不要出现空格；

:::
例如：`C:/go go/bin` 这样的路径是不能被正常使用的；

例如：`C:/go_go/bin` ✔️；

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
