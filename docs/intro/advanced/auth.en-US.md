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
title: Authentication & Authorization
order: 2
toc: content
description: go-admin's login flow — JWT issuance and verification, the captcha mechanism, Casbin role authorization and the public-endpoint allowlist, and why the refresh_token endpoint was removed.
keywords: [go-admin login authentication, JWT authorization, casbin permissions, go-admin public endpoints]
---

# Authentication & Authorization

A request reaching a protected endpoint passes two checks in sequence: **JWT middleware** confirms "who are you", **Casbin middleware** confirms "can you do this". One covers login state, the other permission scope — neither can be skipped.

## Login Flow

```
POST /api/v1/login
{ "username": "admin", "password": "123456", "uuid": "...", "code": "1234" }
```

The process (`Authenticator` in `common/middleware/handler/auth.go`):

1. Bind and validate the parameters;
2. **Verify the captcha** — `uuid` matches the captcha ID returned by `GET /api/v1/getCaptcha`, `code` is what the user typed;
3. Check the username and password, and look up the matching user and role;
4. On success, issue a JWT and return `token` along with its expiry, `expire`.

:::warning
Step 2 is **skipped** when `application.mode: dev` — login doesn't verify the captcha. This is meant to make local development convenient, but the same setting also forces the token's lifetime to roughly 100 years (see [Config Reference](/en-US/configure/settings)).
**Production must run in `prod` mode** — both behaviours only apply under `dev`.

:::

Every login attempt, successful or not, is written to the login log asynchronously — see [Queue](/en-US/intro/advanced/queue). This is gated by `logger.enableddb`; nothing is recorded when it's off.

## What's in the Token, and How It's Carried

The issued JWT carries the user ID, role ID, role key, username and data scope, for later middleware to read out of `c.Get(jwtauth.JwtPayloadKey)`.

The token can be carried in any of three ways:

| Method | Form |
| --- | --- |
| Header | `Authorization: Bearer <token>` |
| Query parameter | `?token=<token>` |
| Cookie | `jwt=<token>` |

## Why There's No Token-Refresh Endpoint

Earlier versions had `GET /api/v1/refresh_token`, used to exchange a token nearing expiry for a new one without logging in again. That endpoint has been **permanently removed** (see [issue #820](https://github.com/go-admin-team/go-admin/issues/820)) because it had a security problem:

- The timestamp `MaxRefresh` was measured against got reset on every refresh, so that cap was effectively never reached — **a leaked token was close to permanently valid**;
- the endpoint was also on the permission exclusion list at the time, callable by any logged-in user regardless of role;
- the official frontend never actually called it.

**Don't add this endpoint back.** If seamless refresh is genuinely needed, the correct approach is to first implement access tokens and refresh tokens as separate things in go-admin-core — a short-lived access token for requests, and a long-lived refresh token used only to mint a new access token and individually revocable — rather than the old shape of "the business token doubles as a refresh token".

Once a token expires, logging in again is the only path; the current version has no way around that step.

## Authorization (Casbin)

Passing the JWT check only proves "logged in" — whether a given endpoint can actually be called is decided by the `AuthCheckRole()` middleware based on Casbin, keyed on role, request path and method.

Three situations skip the Casbin check:

1. **Role key is `admin`** — passes straight through, no permission check at all;
2. **The endpoint is on the exclusion list** — `CasbinExclude` in `common/middleware/settings.go`, which covers public endpoints like login, logout, fetching a captcha, and viewing one's own profile;
3. **Unprotected routes** — a route with no `AuthCheckRole()` middleware attached never goes through this layer to begin with.

Adding a new public endpoint that needs no permission check just means adding it to `CasbinExclude`; the other way round, **don't take the shortcut of adding a real business endpoint to that list** — it means any logged-in user can call it, role notwithstanding.

## The Response When Unauthenticated or Unauthorized

Whether the token is missing, expired, or the permission is insufficient, the response is the same shape:

```json
{
  "code": 401,
  "msg": "..."
}
```

:::warning
The HTTP status is also **200**, not 401 — the same pattern as [Rate Limiting](/en-US/intro/advanced/rate-limit). Deciding whether to redirect to the login page means reading the `code` field in the response body, not the HTTP status.

:::

## Wiring Up a Custom Login Method

To add SMS-code login, third-party OAuth, or another login method, the entry point to change is the `Authenticator` function — it only needs to return a `map[string]interface{}{"user": ..., "role": ...}` that `PayloadFunc` recognises. Everything after login — JWT issuance, Casbin authorization — is reused as-is, with no changes needed.

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
