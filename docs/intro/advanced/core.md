---
title: core
order: 90
toc: menu
group:
  title: 高级使用
  order: 10
---

## 系统配置

系统数据库配置项获取

```go
sdk.Runtime.GetConfig("sys_wechat_webhook")

// 可以根据数据类型使用断言
sdk.Runtime.GetConfig("sys_wechat_webhook").(string)
```

## 内存队列

## 数据库获取

## 上下文用户信息
