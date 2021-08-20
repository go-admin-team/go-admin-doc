# 配置文件

## 创建不同环境的配置文件

go-admin 的配置文件默认放在`config`文件夹下的 `settings.yml` 。

用户可以根据不同的环境创建不同的配置文件：

```sh
# 创建开发环境的配置文件
settings.dev.yml

# 创建生产环境的配置文件
settings.prod.yml

# 创建测试环境的配置文件
settings.test.yml
```

## 添加自定义配置项

在 `settings` 节点下边添加 `extend` ，并在下边创建自己需要的配置项即可。

```yml
settings:
  extend: # 扩展项使用说明
    demo:
      name: data
```

然后，打开文件`config/extend.go`

补充以下代码：

```go
type Extend struct {
	Demo Demo   // 这里配置对应配置文件的结构即可
}

type Demo struct {
	name string
}
```

即可。

## 读取自定义配置项

在需要使用的文件中添加引用

```go
import (
    extConfig "go-admin/config"
)
```

在使用的地方直接使用以下代码即可。

```go
    fmt.Println("extConfig.ExtConfig.Demo.Name", extConfig.ExtConfig.Demo.Name)
```

:::tip 从哪里获得帮助：
如果你在阅读本教程的过程中有任何疑问，可以前往[提交建议](https://github.com/go-admin-team/go-admin/issues/new)。
:::
