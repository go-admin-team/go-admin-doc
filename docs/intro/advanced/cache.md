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
title: 缓存
order: 5
toc: content
description: go-admin 缓存使用：在 Service 层通过 e.Cache 读写缓存，AdapterCache 提供的 Get/Set/Del/Increase 等方法，以及如何配置 Redis 支持多实例共享缓存。
keywords: [go-admin 缓存, golang 缓存使用, AdapterCache, 内存缓存]
---

# 缓存

go-admin 的缓存通过统一的 `AdapterCache` 接口提供，业务代码面向接口调用，不直接依赖具体实现。

默认使用内存缓存，单实例部署不需要额外配置。多实例部署时需要共享缓存（验证码、token 等依赖它的功能才能在实例间保持一致），这时在配置文件中加一段 `redis` 即可：

```yml
settings:
  cache:
    redis:
      addr: 127.0.0.1:6379
      password: your-password
      db: 2
    # memory 字段可以省略；一旦填了 redis，顺序是 redis 优先，memory 不再生效
    memory: ''
```

:::warning
**`redis` 配置错误时，服务无法启动，而不是静默降级为内存缓存。** 连接在启动阶段就会被验证（默认 5 秒超时），地址错、密码错、连不通都会导致启动失败并报错退出——这是有意的设计：与其让一个"名义上共享、实际各用各的"缓存悄悄跑起来，不如启动时就暴露问题。

这与旧版本相反：早期版本里 `redis` 配置完全不会生效，程序会静默使用内存缓存且不报错（[issue #846](https://github.com/go-admin-team/go-admin/issues/846) 记录了这个问题）。如果你看到的文档、教程、或旧版代码库仍是这个描述，那是过时信息——以当前版本的实际行为为准。

:::

完整字段说明见[配置参考](/configure/settings)。

## 在 Service 层使用

`Service` 结构体自带 `Cache` 字段，直接使用：

```go
func (e *Article) GetDetail(id int) (*models.Article, error) {
    key := fmt.Sprintf("article:%d", id)

    // 先查缓存
    if val, err := e.Cache.Get(key); err == nil && val != "" {
        var data models.Article
        if err := json.Unmarshal([]byte(val), &data); err == nil {
            return &data, nil
        }
    }

    // 未命中则查库
    var data models.Article
    if err := e.Orm.First(&data, id).Error; err != nil {
        return nil, err
    }

    // 回写缓存，过期时间 300 秒
    if b, err := json.Marshal(data); err == nil {
        _ = e.Cache.Set(key, string(b), 300)
    }
    return &data, nil
}
```

## 在其他位置使用

不在 Service 中时，通过 Runtime 获取：

```go
cache := sdk.Runtime.GetCacheAdapter()
err := cache.Set("key", "value", 60)
```

## 可用方法

| 方法 | 说明 |
| --- | --- |
| `Get(key)` | 读取，返回字符串 |
| `Set(key, val, expire)` | 写入，`expire` 单位为**秒**，传 0 表示不过期 |
| `Del(key)` | 删除 |
| `HashGet(hk, key)` | 读取哈希字段 |
| `HashDel(hk, key)` | 删除哈希字段 |
| `Increase(key)` / `Decrease(key)` | 自增 / 自减，用于计数场景 |
| `Expire(key, dur)` | 重设过期时间，参数为 `time.Duration` |

`Set` 的 `expire` 是秒，而 `Expire` 接受的是 `time.Duration`，两者单位不同，容易写错。

## 使用建议

**缓存键要有前缀**。多个模块共用同一个缓存空间，`article:123` 这样的命名比 `123` 安全得多，也便于排查。

**缓存读取失败不应中断业务**。上面的示例中，缓存未命中或反序列化失败都会继续查库，而不是直接返回错误——缓存是加速手段，不是数据来源。

**注意数据一致性**。更新数据后需要同步删除对应的缓存，否则会读到旧值：

```go
if err := e.Orm.Save(&data).Error; err != nil {
    return err
}
_ = e.Cache.Del(fmt.Sprintf("article:%d", data.Id))
```

:::warning
内存缓存随进程存在，**服务重启后全部丢失**。不要把不可重建的数据只放在缓存里。

:::

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
