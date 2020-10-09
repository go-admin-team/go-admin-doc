# 常见问题

## 1. Mac 环境中 gyp: No Xcode or CLT version detected!

> 问题详情

```shell
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

```shell
sudo xcode-select --install
```

如果之前安装过，请使用一下命令重置

:::tip
原因是 Mac 升级后，缺了 xcode 的 CLI 工具, 只要执行下面的命令来安装就可以了。
:::

```shell
sudo xcode-select --reset
```

---

## 2. mysql connect error %v dial tcp 127.0.0.1:3306: connect: connection refused

```shell
$ ./go-admin
2020/04/07 14:21:14 root:password@tcp(127.0.0.1:3306)/dbname
2020/04/07 14:21:14 mysql connect error %v dial tcp 127.0.0.1:3306: connect: connection refused
```

> 解决方案

修改配置文件中的 `mysql` 配置信息，配置文件的位置在 `config/settings.yml`，以下内容（只是配置文件中相关内容）是需要修改的配置内容

```shell
  database:
    # 数据库类型 mysql，sqlite3， postgres
    driver: mysql
    # 数据库连接字符串 mysql 缺省信息 charset=utf8&parseTime=True&loc=Local&timeout=1000ms
    source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms
```

:::tip 从哪里获得帮助：
如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。
:::

### 使用 element-ui 的 el-tree 组件 setCheckedKeys

```
"TypeError: Cannot read property 'setCheckedKeys' of undefined"
```

解决方案

```

```
