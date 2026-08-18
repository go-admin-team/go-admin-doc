---
title: 获取帮助
nav:
  title: 帮助
  order: 6
description: 使用 go-admin 遇到问题时的排查顺序、提交 issue 的正确方式与社区交流渠道，帮助更快定位并解决问题。
keywords: [go-admin 问题反馈, go-admin 交流群, go-admin issue, golang 后台管理 求助]
---

# 获取帮助

## 一、先自查

多数问题在文档里已有答案，按下面的顺序找通常最快：

1. **[常见问题](/guide/faq)** —— CGO 编译失败、数据库连不上、依赖安装报错等高频问题都在这里；
2. **[配置参考](/configure/settings)** —— 配置项没生效、redis 配了没反应、token 过期时间不对，先对照这一页确认字段是否被真正读取；
3. **[快速开始](/guide/ksks)** —— 启动流程中的某一步失败时，回到这里逐步核对；
4. **搜索已有 issue** —— 在 [issues](https://github.com/go-admin-team/go-admin/issues?q=is%3Aissue) 中搜索报错关键词，很多问题别人已经遇到过，注意也要搜索已关闭的。

## 二、提交 issue

自查无果时，欢迎[提交 issue](https://github.com/go-admin-team/go-admin/issues/new)。

带上下面这些信息，问题通常能快很多定位；只描述"启动报错了"往往需要多轮追问才能开始排查：

```sh
# 1. 版本号
$ ./go-admin version

# 2. Go 版本与操作系统
$ go version
```

除此之外还请附上：

- **完整的报错输出**，而不是截取的一行。日志请用代码块包裹，不要用截图——截图无法被搜索到，后来遇到同样问题的人就找不到这个 issue；
- **复现步骤**，从哪一步开始出错；
- **相关配置**，注意先删掉数据库密码、`jwt.secret` 等敏感信息；
- **数据库类型与版本**（MySQL / PostgreSQL / SQLite / SQL Server）。

:::warning
不要在 issue、群聊或任何公开场合贴出未脱敏的配置文件。`database.source` 里含有数据库账号密码，`jwt.secret` 泄露后可被用来伪造任意用户的 token。

:::

## 三、参与共建

- **文档有错漏**：本站源码在 [go-admin-doc](https://github.com/go-admin-team/go-admin-doc)，欢迎提 issue 或直接 PR；
- **代码贡献**：go-admin 的开发约定见仓库根目录的 `AGENTS.md`，标准模块的写法可参照 `app/demo/`;
- **功能建议**：同样通过 issue 提出，说明使用场景比描述功能本身更有帮助。

## 四、社区交流

<table>
  <tr>
    <td style="width:185px;">
      <img src="https://doc-image.zhangwj.com/img/wx.png" width="180px">
    </td>
    <td style="width: 185px;">
      <img src="https://doc-image.zhangwj.com/img/qrcode_for_gh_b798dc7db30c_258.jpg" width="180px">
    </td>
    <td style="width: 185px;">
      <img src="https://doc-image.zhangwj.com/img/qq2.png" width="180px">
    </td>
    <td>
      <a href="https://space.bilibili.com/565616721">wenjianzhang</a>
    </td>
  </tr>
  <tr>
    <td>微信</td>
    <td>公众号</td>
    <td><a target="_blank" href="https://shang.qq.com/wpa/qunwpa?idkey=0f2bf59f5f2edec6a4550c364242c0641f870aa328e468c4ee4b7dbfb392627b">QQ 交流群</a></td>
    <td>哔哩哔哩</td>
  </tr>
</table>

:::info
群内提问同样建议附上版本号与完整报错。紧急或复杂的问题，仍建议提交 issue —— 有记录、可检索，也便于后来人查阅。

:::

## 五、商业支持

需要更完整的功能与技术支持，可以了解 [商业授权](/vip)。
