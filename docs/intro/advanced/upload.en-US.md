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
title: File Upload
order: 7
toc: content
description: go-admin's file upload endpoint — single-file, multi-file and base64 modes, the response shape, storage location and access path, and the current state of cloud storage.
keywords: [go-admin file upload, gin upload endpoint, golang image upload, base64 upload]
---

# File Upload

go-admin ships a built-in upload endpoint; the frontend's image-upload components are wired to it by default.

## Endpoint

```
POST /api/v1/public/uploadFile
Content-Type: multipart/form-data
```

Requires authentication. Request parameters:

| Parameter | Location | Notes |
| --- | --- | --- |
| `type` | query | Upload mode: `1` single file, `2` multiple files, `3` base64 — defaults to single-file handling |
| `file` | formData | File content; a base64 string when `type=3` |

## Response Shape

Single-file and base64 return one object; multiple files return an array:

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

`path` is the relative path, used when persisting to the database; `full_path` is the full address with domain, usable directly in the UI.

## Storage and Access

Files are saved under the project's `static/uploadfile/` directory and served externally through the static route `/static` — registered as `sysStaticFileRouter` in `app/admin/router/sys_router.go`.

:::warning
The domain in `full_path` is taken from the request's `Host`, with the protocol hardcoded to `http`. **On a site running HTTPS, the returned address still starts with `http://`**, which the browser blocks as mixed content when loaded from an HTTPS page.

In that case, have the frontend store only `path` and build the protocol and domain itself when displaying it.

:::

Two things to watch when deploying:

- `static/uploadfile/` must exist and be writable; in a containerized deployment it needs to be mounted as a persistent volume, or every file is lost when the container is rebuilt;
- in a multi-instance deployment, each instance's local directory is independent — a file uploaded to instance A isn't reachable from instance B. That scenario needs shared storage or object storage.

## Current State of Cloud Storage

:::error
**Cloud storage does not work right now — don't use it in production.**

`common/file_store/` has three implementations — Alibaba Cloud OSS, Qiniu Kodo, Huawei OBS — and the upload endpoint accepts a `source` parameter (`2` for OSS, `3` for Qiniu) meant to trigger the transfer. But the current code has two problems:

1. **The client is never initialised.** `file_store.OXS` provides the correct initialisation entry point, but nothing in the repository calls it. `ossUpload` constructs `ALiYunOSS{}` directly and calls `UpLoad` on it, at which point the `Client` field is `nil` — and `UpLoad` does a type assertion on it internally, so **passing the `source` parameter causes a panic**.
2. **The Qiniu branch actually calls Alibaba Cloud.** `qiniuUpload` constructs the same `ALiYunOSS` type internally, identical to `ossUpload`.

So upload requests **should not carry the `source` parameter** — use local storage only.

Integrating object storage currently means implementing it yourself: initialise the client following `file_store.OXS.Setup()`, and wire the configuration into [the extend config](/en-US/configure/settings).

:::

## Custom Upload

The built-in endpoint targets generic image uploads. When the business needs more — restricting file type and size, sorting into directories by business, writing a database record after upload — implement it in your own module, following `app/other/apis/file.go`:

```go
func (e File) Upload(c *gin.Context) {
    e.MakeContext(c)

    f, err := c.FormFile("file")
    if err != nil {
        e.Error(422, err, "文件读取失败")
        return
    }

    // size and type validation
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
When implementing this yourself, **don't use the client-supplied filename** directly as the storage path. A filename can contain path-traversal characters like `../`, or collide with an existing file and overwrite it. Rename by timestamp or UUID, and validate the extension.

:::

:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
