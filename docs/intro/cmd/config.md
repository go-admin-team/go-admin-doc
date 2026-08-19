---
nav:
  title: 开发
  order: 2
  second:
    title: 指令
    order: 2
title: config 查看配置
order: 30
toc: content
description: go-admin config 指令：打印当前配置文件解析后的实际取值，用于排查配置未生效的问题；输出包含密钥与数据库密码，注意不要外泄。
keywords: [go-admin config 指令, go 查看配置, 配置未生效排查]
---

## 查看配置

`config` 指令读取配置文件并打印解析后的实际取值，用于确认配置是否按预期生效。

```sh
$ ./go-admin config -c config/settings.yml
```

不带 `-c` 时默认读取 `config/settings.yml`。

## 输出内容

指令会依次打印五个配置块的 JSON：

| 配置块 | 内容 |
| --- | --- |
| `application` | 运行模式、监听地址与端口、读写超时、数据权限开关 |
| `jwt` | 签名密钥与 token 有效期 |
| `database` | 数据库驱动与连接串，多租户下为各租户的配置 |
| `gen` | 代码生成器的数据库名与前端路径 |
| `logger` | 日志路径、等级与开关 |

输出示例：

```json
application: {
   "ReadTimeout": 1,
   "WriterTimeout": 2,
   "Host": "0.0.0.0",
   "Port": 8000,
   "Name": "testApp",
   "Mode": "dev",
   "EnableDP": false
}
```

:::warning
**输出包含敏感信息。** `jwt` 块中是签名密钥，`database` 块中的连接串含数据库账号与密码，均以明文打印。

排查问题时不要把该指令的完整输出直接贴到 issue、群聊或任何公开场合。需要提供时请先删去密钥与密码。

:::

## 适用场景

这条指令主要用于回答"配置到底有没有生效"：

1. **确认读取的是哪个文件** —— 多环境配置容易搞混，输出的值能直接反映实际加载的文件；
2. **确认某项是否被解析** —— 配置文件中写了但不在输出里的项，说明当前版本并不读取它，例如 `locker` 配置块在结构体中没有对应字段；
3. **确认运行模式** —— 上线前检查 `Mode` 是否为 `prod`，避免带着 `dev` 上生产（该模式下登录不校验验证码，且 token 近乎不过期）。

需要注意，指令只打印上述五个配置块，`cache`、`queue`、`ssl` 等不在输出范围内。各配置项的完整说明见[配置参考](/configure/settings)。

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
