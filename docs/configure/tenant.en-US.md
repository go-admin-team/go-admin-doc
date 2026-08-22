---
nav:
  title: Advanced
  order: 4
title: Multi-Tenancy
order: 10
toc: menu
description: A guide to go-admin's multi-tenancy setup — using databases to select a database instance by domain, paired with Nginx forwarding, so one codebase serves multiple tenants, with config examples and gotchas.
keywords: [go-admin multi-tenancy, golang multi-tenancy implementation, saas multi-tenant database, database-per-domain]
---

## Multi-Tenancy

When several companies or organizations share the same system, but each needs its data and org structure kept separate, that's a multi-tenancy scenario.

go-admin has had multi-tenancy built in since 1.x, available in the open-source edition — **no custom development needed, just configuration.**

### How It Works

go-admin's approach is to **select the database by domain**:

```
dev.a.com ──┐
            ├─► the same frontend + backend deployment ──► picks the matching database by request domain
dev.b.com ──┘
```

Only one deployment of the frontend and backend is needed. When a request reaches the backend, it matches the `Host` against the corresponding entry in the `databases` config and uses that tenant's database connection. Tenants are therefore **physically isolated** — each with its own database, no shared tables.

:::info
This approach isolates cleanly and migrates easily, at the cost of one more database instance per tenant as the tenant count grows.

If what you actually need is field-level isolation within a single database (every tenant sharing one table, distinguished by a `tenant_id` column), you'll need to build that yourself — the framework only ships the per-database isolation approach described above.

:::


### Example

Neither the frontend nor the backend needs multiple deployments — one of each is enough.

### **go-admin-ui Frontend**

#### 1. In the go-admin-ui Vue project, find the `.env.development` file and set the following to empty

```vue
    VUE_APP_BASE_API = ''
```

#### 2. When deploying to production
```js
    npm run build:prod
```
##### Put the generated dist files on your Nginx server

#### 3. Configure the Nginx conf file

- For dev or test environments, you can point the frontend address directly at an IP and port:
```nginx
server {
  server_name dev.xxx.com;
  location / {
	 proxy_pass   http://127.0.0.1:9527;
  }
}
```

- For production, map the dist files directly:
```nginx
server {
  server_name dev.xxx.com;
  location / {
	 index index.html index.html;
	 root /data/dist;
	 try_files $uri $uri/ /index.html;

  }
}
```

### **go-admin Backend**

#### 1. In the backend project, find your `xxx.yml` file and set up `databases` like this
```go
  databases:
    'dev.a.com':
      driver: mysql
      source: root:xxx@tcp(127.0.0.1:3306)/goAdmin?charset=utf8&parseTime=True&loc=Local&timeout=2000ms
    'dev.b.com':
      driver: mysql
      source: root:xxx@tcp(127.0.0.1:3306)/goAdmin?charset=utf8&parseTime=True&loc=Local&timeout=2000ms
```
#### 2. Configure the Nginx conf file
```nginx
server{
  server_name dev.a.com;
  location /api/v1{
	  proxy_pass http://127.0.0.1:8000;
	  proxy_set_header Accept $http_host;
	  proxy_set_header Host $host;
	  proxy_set_header X-Real-IP $remote_addr;
	  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header HTTP_X_FORWARDED_FOR $remote_addr;
  }
}

server{
  server_name dev.b.com;
  location /api/v1{
	  proxy_pass http://127.0.0.1:8000;
	  proxy_set_header Accept $http_host;
	  proxy_set_header Host $host;
	  proxy_set_header X-Real-IP $remote_addr;
	  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header HTTP_X_FORWARDED_FOR $remote_addr;
  }
}

```


### FAQ

The config is set up, but the app is still hitting the default database.

Fix: check your Nginx config against this:
```conf
location /api {
  proxy_pass http://web:8080/api;
  proxy_set_header Accept $http_host;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header HTTP_X_FORWARDED_FOR $remote_addr;
}
```
