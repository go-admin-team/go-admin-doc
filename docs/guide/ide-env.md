---
title: IDE 配置
order: 100
toc: menu
---

目前`Go`的`IDE`有比较流行有`VSCode`和 JetBrains 公司的`Goland`。由于 JetBrains 也是 go-admin 脚手架的赞助商，因此我们优先推荐使用`Goland`来作为开发 IDE，下载及注册请参考网上教程（[百度](https://www.baidu.com) 或 [Google](https://www.goole.com)）。

[JetBrains 的官网](https://www.jetbrains.com)

## goland

### 启动 IDE

首先，打开`goland`。
<img src="http://doc-image.zhangwj.com/img/goland-step1.png" width="400px" />

### 创建项目

创建一个`helloworld`项目。
<img src="http://doc-image.zhangwj.com/img/goland-step3.png" width="400px" />

指定项目创建的位置。
<img src="http://doc-image.zhangwj.com/img/goland-step2.png" width="400px" />

创建`main.go`文件。鼠标`右键`选中`新建`，然后`Go 文件`。
<img src="http://doc-image.zhangwj.com/img/goland-step4.png" width="400px" />

选择`空文件`。
<img src="http://doc-image.zhangwj.com/img/goland-step5.png" width="400px" />

修改`package`名称为`main`。
<img src="http://doc-image.zhangwj.com/img/goland-step6.png" width="400px" />

写一段简单的代码，输出一个`Hello World！`
<img src="http://doc-image.zhangwj.com/img/goland-step7.png" width="400px" />

点击`运行`
<img src="http://doc-image.zhangwj.com/img/goland-step8.png" width="400px" />

选择`go build main.go`
<img src="http://doc-image.zhangwj.com/img/goland-step9.png" width="400px" />

goland 会在底部运行窗口中，将运行结果打印。
<img src="http://doc-image.zhangwj.com/img/goland-step10.png" width="400px" />

恭喜你，第一个`Go`语言的程序就成功 run 起来了！

## VS Code

### 运行 VS Code

先创建一个工作目录，然后打开目录；
<img src="http://doc-image.zhangwj.com/img/vscode-step1.png" width="400px" />

新建`main.go`文件。
<img src="http://doc-image.zhangwj.com/img/vscode-step2.png" width="400px" />

把 hello wordl 代码写入文件中。
<img src="http://doc-image.zhangwj.com/img/vscode-step3.png" width="400px" />

选择`运行`，`终端`激活 vscode 的终端窗口。
<img src="http://doc-image.zhangwj.com/img/vscode-step4.png" width="400px" />

在终端里边键入`go build main.go`，执行成功会编译一个可运行二进制包，直接使用`./main`运行即可；如果是 windows 略有差异，windows 下编译的包需要使用`main.exe`执行。
<img src="http://doc-image.zhangwj.com/img/vscode-step5.png" width="400px" />

成功！

:::warning
从哪里获得帮助：

如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。

:::
