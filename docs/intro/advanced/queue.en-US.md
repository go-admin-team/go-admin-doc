---
nav:
  title: Development
  order: 2
  second:
    title: Advanced
    order: 1
group:
  title: Advanced Capabilities
  order: 7
title: Queue
order: 6
toc: content
description: Using the queue in go-admin — registering a consumer function, appending messages, how a consumer is written, the real example of the framework using a queue to write operation logs asynchronously, and how to configure a Redis-backed queue for cross-instance delivery.
keywords: [go-admin queue, golang message queue, asynchronous task processing, AdapterQueue]
---

# Queue

A queue moves slow work out of the request flow. go-admin itself uses one this way: operation and login logs aren't written to the database inside the request — they're appended to a queue and written asynchronously, so logging doesn't slow the response down.

It uses an in-process, first-in-first-out memory queue by default, good enough for a "losing it is acceptable" case like logging. It has two inherent limits:

- **messages don't cross processes** — in a multi-instance deployment, each instance only consumes what it produced itself;
- **messages aren't persisted** — anything unconsumed is lost on restart.

Don't put anything that can't be lost on the memory queue — a payment callback, an order-status transition. Those need a queue that's visible across instances and persists messages, which just means adding a `redis` section to the config file:

```yml
settings:
  queue:
    redis:
      addr: 127.0.0.1:6379
      password: your-password
      group: go-admin        # consumer group; every instance of one app must use the same value
      key_prefix: go-admin   # prepended to the stream key, used to isolate several apps sharing one redis
      max_attempts: 5        # max retries for a message that fails to deliver
```

The `redis` option is backed by Redis Streams — messages are persisted, consumer groups are supported, and each instance processes a given message exactly once.

:::warning
As with the cache, **a misconfigured `redis` section stops the service from starting** rather than silently falling back to the memory queue — a wrong address or password fails at startup with an error. An earlier version had this the other way round: the `redis` section simply never took effect and the program silently kept using the memory queue (documented in [issue #846](https://github.com/go-admin-team/go-admin/issues/846)). If you see that description somewhere, it's outdated.

:::

## Registering a Consumer Function

Consumer functions are registered at service startup — see `cmd/api/server.go`:

```go
queue := sdk.Runtime.GetQueuePrefix("")
queue.Register(global.LoginLog, models.SaveLoginLog)
queue.Register(global.OperateLog, models.SaveOperaLog)
go queue.Run()
```

`Register`'s first argument is the queue name (the message's stream), the second is the consumer function. `Run()` needs to run in its own goroutine — it blocks and keeps consuming.

:::warning
**`Run()` must be called after `Register`, for both backends.** In an earlier version, the memory queue's `Register` started consuming on its own, which made it easy to assume `Run()` wasn't needed. Both implementations require an explicit `Run()` now — skip it, and messages get `Append`ed but are never consumed.

:::

## Writing a Consumer Function

A consumer function's signature is `func(storage.Messager) error`:

```go
func SaveOperaLog(message storage.Messager) (err error) {
    // under multi-tenancy, resolve the right database from the message's prefix
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

The message content is retrieved via `GetValues()`, a `map[string]interface{}` — typically marshalled and unmarshalled into the target struct.

:::info
Note that the code above returns `nil` on error rather than `err`. That's deliberate: a failure to write a log shouldn't cause the message to be retried repeatedly.

What to actually return depends on the use case — anything that needs a retry should return the error.

:::

## Appending a Message

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

`GetStreamMessage`'s three arguments are the message ID (leave blank to auto-generate), the queue name, and the message content. `values` is a `map[string]interface{}`.

`GetQueuePrefix` is passed `c.Request.Host` so that, under multi-tenancy, the message carries the tenant prefix, which a consumer reads back via `message.GetPrefix()` to write to the right database. Pass an empty string for single-tenant.

:::warning
A failed append is only logged, not treated as a request failure. The queue is a side-channel capability — a problem with it shouldn't fail the main flow, which is exactly how the framework itself handles it when recording operation logs.

:::

## Adding Your Own Queue

Adding a new queue of your own takes three steps:

1. **Define the queue name**, ideally centralised as a constant rather than scattered as string literals:

   ```go
   const ExportTask = "export_task"
   ```

2. **Register a consumer function**, adding a line to the registration in `cmd/api/server.go`;

3. **Append messages from business code**, the same way as above.

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
