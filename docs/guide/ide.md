# IDE 开发

众多 IDE 里边，推荐使用 `goland IDE`进行调试

首先我们启动 `Goland` , 点击 `Open Project`，下图红框圈选部分；

![](https://gitee.com/mydearzwj/image/raw/master/img/ideqidongv1.1.0.png)

选择 go-admin 存放的路径，找到并打开；

## 配置 GOPORXY

然后选择`Goland` > `Preferences` ；

![](https://gitee.com/mydearzwj/image/raw/master/img/idepeizhigoproxy.png)

## 添加运行或调试配置

### 添加 init 配置

1. 打开`Edit Configurations`

![](https://gitee.com/mydearzwj/image/raw/master/img/ide1.png)

2. 选择 `+` > `go build`

![](https://gitee.com/mydearzwj/image/raw/master/img/ide2.png)

3. 按照下图所示进行配置，注意：填写 `Program arguments` 为 `init -c=config/settings.dev.yml`，完成之后点击保存

![](https://gitee.com/mydearzwj/image/raw/master/img/ide3.png)

4. 修改数据库

![](https://gitee.com/mydearzwj/image/raw/master/img/ide4-1.1.0.png)

5. 初使化

![](https://gitee.com/mydearzwj/image/raw/master/img/ide5.png)

### 添加 server 配置

1. 打开`Edit Configurations`
   ![](https://gitee.com/mydearzwj/image/raw/master/img/ide6.png)

2. 选择 `+` > `go build`

![](https://gitee.com/mydearzwj/image/raw/master/img/ide2.png)

3. 按照下图所示进行配置，注意：填写 `Program arguments` 为`server -c=config/settings.dev.yml`，完成之后点击保存

![](https://gitee.com/mydearzwj/image/raw/master/img/ide8.png)

1. 启动 debug
   ![](https://gitee.com/mydearzwj/image/raw/master/img/ide9.png)

:::tip
特别感谢 海马同学 的支持，对文档的维护起到了至关重要的角色
:::
