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
title: Cache
order: 5
toc: content
description: Using the cache in go-admin — reading and writing through e.Cache in the Service layer, the Get/Set/Del/Increase and other methods AdapterCache provides, and how to configure Redis so multiple instances share one cache.
keywords: [go-admin cache, golang caching, AdapterCache, in-memory cache]
---

# Cache

go-admin's cache is exposed through a unified `AdapterCache` interface; business code talks to the interface and never depends on a specific implementation directly.

It uses an in-memory cache by default, which needs no extra configuration for a single-instance deployment. A multi-instance deployment needs a shared cache (features like captchas and tokens that depend on it only stay consistent across instances if it's shared), which just means adding a `redis` section to the config file:

```yml
settings:
  cache:
    redis:
      addr: 127.0.0.1:6379
      password: your-password
      db: 2
    # the memory field can be omitted; once redis is filled in, redis takes priority and memory no longer applies
    memory: ''
```

:::warning
**A misconfigured `redis` section stops the service from starting, rather than silently falling back to the in-memory cache.** The connection is verified during startup (a 5-second timeout by default) — a wrong address, wrong password, or unreachable server all cause the service to fail to start and exit with an error. This is deliberate: better to surface the problem at startup than let a cache that's supposedly shared but actually isn't run quietly.

This is the opposite of an earlier version, where a `redis` section simply never took effect and the program silently used the in-memory cache with no error at all (documented in [issue #846](https://github.com/go-admin-team/go-admin/issues/846)). If a document, tutorial, or older copy of the codebase still describes it that way, that's outdated — go by the current version's actual behaviour.

:::

See [Config Reference](/en-US/configure/settings) for the full field list.

## Using It in the Service Layer

The `Service` struct carries a `Cache` field already — just use it:

```go
func (e *Article) GetDetail(id int) (*models.Article, error) {
    key := fmt.Sprintf("article:%d", id)

    // check the cache first
    if val, err := e.Cache.Get(key); err == nil && val != "" {
        var data models.Article
        if err := json.Unmarshal([]byte(val), &data); err == nil {
            return &data, nil
        }
    }

    // fall through to the database on a miss
    var data models.Article
    if err := e.Orm.First(&data, id).Error; err != nil {
        return nil, err
    }

    // write back to cache, 300-second expiry
    if b, err := json.Marshal(data); err == nil {
        _ = e.Cache.Set(key, string(b), 300)
    }
    return &data, nil
}
```

## Using It Elsewhere

Outside a Service, get it via Runtime:

```go
cache := sdk.Runtime.GetCacheAdapter()
err := cache.Set("key", "value", 60)
```

## Available Methods

| Method | Description |
| --- | --- |
| `Get(key)` | Reads, returns a string |
| `Set(key, val, expire)` | Writes; `expire` is in **seconds**, `0` means no expiry |
| `Del(key)` | Deletes |
| `HashGet(hk, key)` | Reads a hash field |
| `HashDel(hk, key)` | Deletes a hash field |
| `Increase(key)` / `Decrease(key)` | Increment / decrement, for counters |
| `Expire(key, dur)` | Resets the expiry; takes a `time.Duration` |

`Set`'s `expire` is in seconds, while `Expire` takes a `time.Duration` — the units differ and it's easy to get this wrong.

## Recommendations

**Prefix your cache keys.** Multiple modules share the same cache space; a name like `article:123` is much safer than plain `123`, and easier to trace when debugging.

**A cache-read failure shouldn't break the business flow.** In the example above, both a cache miss and a deserialization failure fall through to the database instead of returning an error directly — a cache speeds things up, it isn't the source of truth.

**Watch data consistency.** Deleting the corresponding cache entry after an update is required, or a stale value keeps getting read:

```go
if err := e.Orm.Save(&data).Error; err != nil {
    return err
}
_ = e.Cache.Del(fmt.Sprintf("article:%d", data.Id))
```

:::warning
The in-memory cache lives as long as the process does — **it's entirely lost on a restart**. Don't keep data there that can't be rebuilt from elsewhere.

:::

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
