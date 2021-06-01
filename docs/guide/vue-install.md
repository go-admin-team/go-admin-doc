# Vue 开发环境

::: tip
本节内容为 Node.js 开发环境及 IDE 配置教程，仅针对前端新选手，老司机请绕行。
[老司机绕行](/guide/ksks.html)
:::

## node.js & npm 安装

### 下载

官方下载地址 [https://nodejs.org/zh-cn/download/](https://nodejs.org/zh-cn/download/) ，可以选择适合自己操作系统的版本，建议选择长期支持版下载对应的版本：

![](https://gitee.com/mydearzwj/image/raw/master/img/nodejs-down.png)

### 安装

双击下载好的安装包，按照以下流程进行操作；

![](https://gitee.com/mydearzwj/image/raw/master/img/nodejs-step1.png)

![](https://gitee.com/mydearzwj/image/raw/master/img/nodejs-step2.png)

![](https://gitee.com/mydearzwj/image/raw/master/img/nodejs-step3.png)

![](https://gitee.com/mydearzwj/image/raw/master/img/nodejs-step4.png)

![](https://gitee.com/mydearzwj/image/raw/master/img/nodejs-step5.png)

上图可以看出`Node.js`的`v14.17.0`版本，已经安装到了`/usr/local/bin/node`下,`npm`的`v6.14.13`版本，已经安装到了`/usr/local/bin/npm`下,

到这一步就说明`Node.js` & `NPM`已经安装好了！

### 验证

检查`node.js`版本信息，

```sh
$  node -v
v14.17.0
```

看到以上信息说明当前 node.js 工作环境已经安装成功了`v14.17.0`；

接下来，检查`npm`版本信息，

```sh
$  npm -v
6.14.13
```

看到以上信息说明当前 npm 已经安装成功了`6.14.13`；

:::tip
如果您在安装过程中遇到了其他问题，也可以通过[反馈](https://github.com/go-admin-team/go-admin/issues)的方式一起解决您的问题，同时我们很期待您的建议。
:::
