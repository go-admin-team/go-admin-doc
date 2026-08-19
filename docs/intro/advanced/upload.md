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
title: 文件上传
order: 7
toc: content
description: go-admin 文件上传接口：单图、多图与 base64 三种模式的调用方式与返回结构，存储位置与访问路径，以及云存储当前的可用状态。
keywords: [go-admin 文件上传, gin 上传接口, golang 图片上传, base64 上传]
---

# 文件上传

go-admin 内置了上传接口，前端的图片上传组件默认对接的就是它。

## 接口

```
POST /api/v1/public/uploadFile
Content-Type: multipart/form-data
```

需要携带认证信息。请求参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `type` | query | 上传模式：`1` 单文件、`2` 多文件、`3` base64，默认按单文件处理 |
| `file` | formData | 文件内容；`type=3` 时为 base64 字符串 |

## 返回结构

单文件与 base64 返回一个对象，多文件返回数组：

```json
{
  "code": 200,
  "data": {
    "size": 20480,
    "path": "static/uploadfile/xxx.png",
    "full_path": "http://localhost:8000/static/uploadfile/xxx.png",
    "name": "xxx.png",
    "type": "image/png"
  },
  "msg": "上传成功",
  "requestId": "..."
}
```

`path` 是相对路径，用于入库；`full_path` 是带域名的完整地址，可直接用于页面展示。

## 存储与访问

文件保存在项目目录下的 `static/uploadfile/`,通过静态路由 `/static` 对外访问——路由注册见 `app/admin/router/sys_router.go` 中的 `sysStaticFileRouter`。

:::warning
`full_path` 中的域名取自请求的 `Host`,协议固定拼接为 `http`。**站点启用 HTTPS 时返回的会是 `http://` 开头的地址**，在 HTTPS 页面中加载会被浏览器拦截为混合内容。

这种情况下建议前端只保存 `path`,展示时自行拼接协议与域名。

:::

部署时需要注意两点：

- `static/uploadfile/` 目录必须存在且可写，容器化部署时需要挂载为持久卷，否则容器重建后文件全部丢失；
- 多实例部署时各实例的本地目录互相独立，A 实例上传的文件在 B 实例上访问不到。这种场景需要共享存储或对象存储。

## 云存储的当前状态

:::error
**云存储目前不可用，不要在生产中使用。**

`common/file_store/` 下有阿里云 OSS、七牛 Kodo、华为 OBS 三种实现，上传接口也接受 `source` 参数（`2` 为 OSS、`3` 为七牛）来触发转存。但当前代码存在两个问题：

1. **客户端从未初始化。** `file_store.OXS` 提供了正确的初始化入口，但仓库中没有任何地方调用它。`ossUpload` 直接构造 `ALiYunOSS{}` 就调用 `UpLoad`,此时 `Client` 字段为 `nil`,而 `UpLoad` 内部会对它做类型断言——**传入 `source` 参数会导致 panic**。
2. **七牛分支实际调用的是阿里云。** `qiniuUpload` 内部构造的同样是 `ALiYunOSS`,与 `ossUpload` 完全一致。

因此上传请求**不要携带 `source` 参数**,只使用本地存储。

需要对接对象存储时，目前只能自行实现：参考 `file_store.OXS.Setup()` 完成客户端初始化，并把配置读取接入 [extend 扩展配置](/configure/settings)。

:::

## 自定义上传

内置接口面向的是通用图片上传。业务上有额外要求时——限制文件类型与大小、按业务分目录、上传后写入数据库记录——建议在自己的模块中实现，参考 `app/other/apis/file.go` 的写法：

```go
func (e File) Upload(c *gin.Context) {
    e.MakeContext(c)

    f, err := c.FormFile("file")
    if err != nil {
        e.Error(422, err, "文件读取失败")
        return
    }

    // 大小与类型校验
    if f.Size > 5<<20 {
        e.Error(422, nil, "文件不能超过 5MB")
        return
    }

    dst := "static/uploadfile/" + f.Filename
    if err := c.SaveUploadedFile(f, dst); err != nil {
        e.Logger.Errorf("save file error: %s", err.Error())
        e.Error(500, err, "文件保存失败")
        return
    }
    e.OK(dst, "上传成功")
}
```

:::warning
自行实现时**不要直接使用客户端提交的文件名**作为存储路径。文件名中可能包含 `../` 等路径穿越字符，也可能与既有文件重名而相互覆盖。建议按时间戳或 UUID 重命名，并校验扩展名。

:::

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
