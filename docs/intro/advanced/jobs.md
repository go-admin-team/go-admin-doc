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
title: 定时任务
order: 5
toc: content
description: go-admin 定时任务：任务的注册、cron 表达式配置与执行方式，支持接口调用与函数调用两种类型。
keywords: [go-admin 定时任务, golang cron 定时任务, go 计划任务]
---

## 定时任务

系统目前是支持两种定时类型，一种是函数类型，一种是接口类型，来支持多样的业务；

### HttpJob 接口类型

接口类型是比较简单的，在系统中配置好调用的接口地址、调用周期即可；

### ExecJob 函数类型

函数类型是需要使用代码来完成的业务，这个时候我们需要使用函数类型；

系统中给出了一个示例：

`jobs`目录中可以看到`examples.go`的文件，这里边是给出的一个示例代码；

下面我们针对示例代码做一下介绍：

第一步：需要创建一个结构体，这个结构体需要实现`JobCore`接口；如：ExamplesOne，里边实现了`Exec`方法；
```go
type ExamplesOne struct {
}

func (t ExamplesOne) Exec(arg interface{}) error {
	str := "JobCore ExamplesOne exec success"
	// TODO: 这里需要注意 Examples 传入参数是 string 所以 arg.(string)；请根据对应的类型进行转化；
	switch arg.(type) {

	case string:
		if arg.(string) != "" {
			logger.Info(str, arg.(string))
		} else {
			logger.Warn(str, "arg is nil")
		}
		break
	}

	return nil
}
```

第二步：需要在InitJob中注册这个结构体；如：ExamplesOne；需要将结构体的名称作为key，结构体作为value；这样重新启动项目，就可以在系统中进行配置并使用了；

```go
func InitJob() {
	jobList = map[string]JobsExec{
		"ExamplesOne": ExamplesOne{},
		// ...
	}
}
```
