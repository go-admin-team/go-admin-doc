---
nav:
  title: 开发
  order: 2
  second:
    title: 进阶
    order: 1
group:
  title: 进阶能力
  order: 7
title: 队列
order: 6
toc: content
description: go-admin 队列使用：注册消费函数、投递消息、消费者的写法，框架自身用队列异步落库操作日志的实际例子，以及如何配置 Redis 队列实现跨实例投递。
keywords: [go-admin 队列, golang 消息队列, 异步任务处理, AdapterQueue]
---

# 队列

队列用于把耗时操作从请求流程中移出去。go-admin 自身就在用它：操作日志与登录日志不在请求中直接写库，而是投递到队列后异步落库，避免记日志拖慢接口响应。

默认使用内存队列，进程内先进先出，够用于日志落库这类"丢了也能接受"的场景。它有两个天然限制：

- **消息不跨进程**，多实例部署时各实例只消费自己产生的消息；
- **消息不持久化**，服务重启后未消费的消息全部丢失。

不要用内存队列承载不可丢失的业务，例如支付回调、订单状态流转。这类场景需要跨实例可见、可持久化的队列，在配置文件中加一段 `redis` 即可切换：

```yml
settings:
  queue:
    redis:
      addr: 127.0.0.1:6379
      password: your-password
      group: go-admin        # 消费组，同一应用的多个实例必须用同一个值
      key_prefix: go-admin   # 加在 stream key 前面，多个应用共用一个 redis 时用它隔离
      max_attempts: 5        # 消息投递失败的最大重试次数
```

`redis` 段基于 Redis Stream 实现，消息持久化、支持消费组、多实例各自只处理一次。

:::warning
与缓存一样，**`redis` 配置错误时服务无法启动**，不是静默降级为内存队列——地址错、密码错都会在启动阶段直接报错退出。早期版本里这里是反过来的：redis 配置完全不生效，程序会静默改用内存队列（[issue #846](https://github.com/go-admin-team/go-admin/issues/846) 记录了这个问题），如果你看到的是这个说法，那是过时信息。

:::

## 注册消费函数

消费函数在服务启动时注册，参考 `cmd/api/server.go`：

```go
queue := sdk.Runtime.GetQueuePrefix("")
queue.Register(global.LoginLog, models.SaveLoginLog)
queue.Register(global.OperateLog, models.SaveOperaLog)
go queue.Run()
```

`Register` 的第一个参数是队列名（消息的 stream），第二个是消费函数。`Run()` 需要放在独立的 goroutine 中，它会阻塞并持续消费。

:::warning
**`Register` 之后必须调用 `Run()`，两种后端都一样。** 内存队列在早期版本中 `Register` 会自行开始消费，容易让人误以为不调用 `Run()` 也能工作——现在两种实现都要求显式 `Run()`，漏掉时消息会被 `Append` 进去，但永远不会被消费。

:::

## 消费函数的写法

消费函数的签名是 `func(storage.Messager) error`：

```go
func SaveOperaLog(message storage.Messager) (err error) {
    // 多租户下按消息前缀取对应的数据库
    db := sdk.Runtime.GetDbByTenant(message.GetPrefix())
    if db == nil {
        log.Errorf("host[%s]'s db not exist", message.GetPrefix())
        return nil
    }

    rb, err := json.Marshal(message.GetValues())
    if err != nil {
        log.Errorf("json Marshal error, %s", err.Error())
        return nil
    }

    var l SysOperaLog
    if err := json.Unmarshal(rb, &l); err != nil {
        return nil
    }
    return db.Create(&l).Error
}
```

消息内容通过 `GetValues()` 取出，是一个 `map[string]interface{}`，通常先序列化再反序列化到目标结构体。

:::info
注意上面的写法在出错时返回的是 `nil` 而不是 `err`。这是刻意的：日志落库失败不应导致消息被反复重试。

具体返回什么取决于业务——需要重试的场景应当返回错误。

:::

## 投递消息

```go
q := sdk.Runtime.GetQueuePrefix(c.Request.Host)
message, err := sdk.Runtime.GetStreamMessage("", global.OperateLog, values)
if err != nil {
    log.Errorf("GetStreamMessage error, %s", err.Error())
} else {
    if err := q.Append(message); err != nil {
        log.Errorf("Append message error, %s", err.Error())
    }
}
```

`GetStreamMessage` 的三个参数分别是消息 ID（留空自动生成）、队列名、消息内容。`values` 是 `map[string]interface{}`。

`GetQueuePrefix` 传入 `c.Request.Host`，多租户下消息会带上租户前缀，消费时通过 `message.GetPrefix()` 取回，从而写入正确的库。单租户传空字符串即可。

:::warning
投递失败只记录日志、不中断请求。队列是旁路能力，它出问题不应该让主流程失败——框架自身记录操作日志时就是这么处理的。

:::

## 自定义队列

新增一个自己的队列，需要三步：

1. **定义队列名**，建议集中放在常量中，避免字符串散落各处：

   ```go
   const ExportTask = "export_task"
   ```

2. **注册消费函数**，在 `cmd/api/server.go` 的注册处追加一行；

3. **在业务代码中投递消息**，写法同上。

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
