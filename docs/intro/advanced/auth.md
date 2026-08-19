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
title: 认证与鉴权
order: 2
toc: content
description: go-admin 登录认证流程：JWT 签发与校验、验证码机制、Casbin 角色鉴权与公开接口白名单，以及为什么 refresh_token 接口被移除。
keywords: [go-admin 登录认证, JWT 鉴权, casbin 权限, go-admin 免登录接口]
---

# 认证与鉴权

一个请求要访问受保护的接口，需要依次通过两层检查：**JWT 中间件**确认"你是谁"，**Casbin 中间件**确认"你能不能做这件事"。两层分别对应登录状态与权限范围，缺一不可。

## 登录流程

```
POST /api/v1/login
{ "username": "admin", "password": "123456", "uuid": "...", "code": "1234" }
```

处理过程（`common/middleware/handler/auth.go` 中的 `Authenticator`）：

1. 绑定并校验参数；
2. **校验验证码**——`uuid` 对应 `GET /api/v1/getCaptcha` 返回的验证码 ID，`code` 是用户输入的验证码；
3. 校验用户名密码，查出对应的用户与角色；
4. 成功后签发 JWT，返回 `token` 与过期时间 `expire`。

:::warning
第 2 步在 `application.mode: dev` 时会被**跳过**——登录不校验验证码。这是为了方便本地开发，
但同一个配置项还会把 token 有效期强制设为约 100 年（见[配置参考](/configure/settings)）。
**生产环境必须使用 `prod` 模式**，两个行为都只在 `dev` 下生效。

:::

登录尝试（无论成功失败）会异步写入登录日志，见[队列](/intro/advanced/queue)；该行为受 `logger.enableddb` 控制，关闭时不记录。

## Token 的构成与传递

签发的 JWT 中包含用户 ID、角色 ID、角色标识、用户名与数据权限范围，供后续中间件从 `c.Get(jwtauth.JwtPayloadKey)` 中取出使用。

Token 可以通过三种方式携带，任选其一：

| 方式 | 写法 |
| --- | --- |
| 请求头 | `Authorization: Bearer <token>` |
| Query 参数 | `?token=<token>` |
| Cookie | `jwt=<token>` |

## 为什么没有刷新 token 的接口

早期版本提供过 `GET /api/v1/refresh_token`,用于在 token 快过期时换取新 token 而不必重新登录。该接口已经**永久移除**（见 [issue #820](https://github.com/go-admin-team/go-admin/issues/820)），原因是它存在安全问题：

- 续期上限 `MaxRefresh` 依据的时间戳在每次续期时被一并重置，导致这个上限实际上永远不会到达——**token 一旦泄露，几乎等同于永久有效**；
- 该接口当时还被列入权限排除名单，任何已登录用户都能调用，不受角色限制；
- 官方前端从未真正调用过它。

**不要自行加回这个接口。** 如果确实需要无感续期，正确的做法是先在 go-admin-core 中把 access token 与 refresh token 分开实现——短期的 access token 用于请求，长期的 refresh token 只用于换取新 access token 且能够被单独吊销，而不是延用现在这种"业务 token 直接当 refresh token 用"的方式。

Token 过期后重新登录即可，当前版本没有绕开这一步的机制。

## 权限鉴定（Casbin）

通过 JWT 校验只说明"已登录"，能不能访问某个接口由 `AuthCheckRole()` 中间件基于 Casbin 判断，依据是角色标识、请求路径与请求方法。

三种情况会跳过 Casbin 校验：

1. **角色标识为 `admin`** —— 直接放行，不做任何权限检查；
2. **接口在排除名单中** —— `common/middleware/settings.go` 里的 `CasbinExclude`,登录、登出、获取验证码、查看个人信息等公开接口都在其中；
3. **未受保护的路由** —— 没有挂 `AuthCheckRole()` 中间件的路由本来就不经过这一层。

新增一个不需要权限校验的公开接口时，把它加入 `CasbinExclude` 即可；反过来，**business 接口不要图省事加进这个名单**——它意味着任何登录用户都能调用，不受角色限制。

## 未认证 / 无权限时的响应

无论是 token 缺失过期，还是权限不足，返回的都是：

```json
{
  "code": 401,
  "msg": "..."
}
```

:::warning
HTTP 状态码同样是 **200**，不是 401——与[限流](/intro/advanced/rate-limit)的响应方式一致。判断是否需要跳转登录页，需要读取响应体中的 `code` 字段而不是 HTTP 状态码。

:::

## 自定义登录方式

需要接入短信验证码登录、第三方 OAuth 等其他登录方式时，改造入口是 `Authenticator` 函数——它只需要返回一个能被 `PayloadFunc` 识别的 `map[string]interface{}{"user": ..., "role": ...}`,登录之后的 JWT 签发、Casbin 鉴权都是复用的，不需要改动。

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
