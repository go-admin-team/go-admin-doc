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
title: Scheduled Jobs
order: 9
toc: content
description: go-admin scheduled jobs — registering a job, configuring the cron expression and how it runs, supporting both an HTTP-call type and a function-call type.
keywords: [go-admin scheduled jobs, golang cron jobs, go scheduled tasks]
---

## Scheduled Jobs

The system currently supports two job types — a function type and an HTTP type — to cover different kinds of work.

### HttpJob (HTTP Type)

The HTTP type is the simpler of the two: just configure the endpoint URL and the run interval in the system.

### ExecJob (Function Type)

The function type is for work that needs to be done in code — that's when you reach for this type.

The system ships an example: look in the `jobs` directory for `examples.go`, which contains sample code.

Here's a walkthrough of that example:

Step one: create a struct that implements the `JobCore` interface — for example, `ExamplesOne`, which implements the `Exec` method:
```go
type ExamplesOne struct {
}

func (t ExamplesOne) Exec(arg interface{}) error {
	str := "JobCore ExamplesOne exec success"
	// TODO: note that Examples passes its argument as a string, so it's asserted as arg.(string); convert according to your actual type.
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

Step two: register the struct in `InitJob` — for example, `ExamplesOne` — using the struct's name as the key and the struct itself as the value. After that, restarting the project makes it available to configure and use in the system:

```go
func InitJob() {
	jobList = map[string]JobsExec{
		"ExamplesOne": ExamplesOne{},
		// ...
	}
}
```


:::warning
Where to get help:

If anything in this guide is unclear, please [open an issue](https://github.com/go-admin-team/go-admin/issues/new).

:::
