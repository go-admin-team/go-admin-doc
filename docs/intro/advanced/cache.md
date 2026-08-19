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
order: 3
toc: content
description: go-admin 缓存使用：在 Service 层通过 e.Cache 读写缓存，AdapterCache 提供的 Get/Set/Del/Increase 等方法，以及当前版本只支持内存缓存所带来的限制。
keywords: [go-admin 缓存, golang 缓存使用, AdapterCache, 内存缓存]
---

# 缓存

go-admin 的缓存通过统一的 `AdapterCache` 接口提供，业务代码面向接口调用，不直接依赖具体实现。

:::error
**当前版本只有内存实现。**

配置文件中虽然保留了被注释的 `redis` 样例，但该版本 core 的 `Cache` 结构体只有 `memory` 一个字段，`Setup()` 无条件返回内存缓存——即使填写正确也不会生效，且没有任何报错。

这意味着**多实例部署时缓存不共享**：每个实例各自持有一份数据，验证码、token 等依赖缓存的功能会在实例之间不一致。单实例部署不受影响。

详见[配置参考](/configure/settings)与 [issue #846](https://github.com/go-admin-team/go-admin/issues/846)。

:::

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
