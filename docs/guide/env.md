# 环境变量

## windows

右键`我的电脑`，选择`属性`;

![](https://gitee.com/mydearzwj/image/raw/master/img/wodediannaoshuxing.png)

点击`高级系统设置`；

![](https://gitee.com/mydearzwj/image/raw/master/img/xitongshuxing.png)

点击`环境变量`；

![](https://gitee.com/mydearzwj/image/raw/master/img/huanjingbianliang1.png)

1. 点击`新建`；
2. 填写 变量名 `GO111MODULE`, 变量值 `on`；

![](https://gitee.com/mydearzwj/image/raw/master/img/huanjingbianliang2.png)

1. 点击`确定`;
2. 点击`新建`；
3. 填写 变量名 `GOPROXY`, 变量值 `https://goproxy.cn`；

![](https://gitee.com/mydearzwj/image/raw/master/img/huanjingbianliang3.png)

1. 点击`确定`;

![](https://gitee.com/mydearzwj/image/raw/master/img/huanjingbianliang4.png)

1. 点击`确定`;

2. 重新打开 `CMD`，立即生效

## MacOS

```bash
$ go env -w GOPROXY=https://goproxy.cn,direct
$ go env -w GO111MODULE=on
```

## linux

```bash
$ go env -w GOPROXY=https://goproxy.cn,direct
$ go env -w GO111MODULE=on
```
