---
nav:
  title: Development
  order: 2
  second:
    title: Advanced
    order: 1
group:
  title: Code Generation
  order: 6
title: Generating Business Code
order: 2
toc: content
description: go-admin code generation steps — pick a database table, configure field attributes, and generate frontend and backend CRUD code.
keywords: [go-admin code generation, golang crud generation, automatic frontend/backend code generation]
---

## Generating Code

Start `go-admin` and sign in.

<img src="https://doc-image.zhangwj.com/img/dashboradv1.0.0.png" width="700xp" />

Once the dashboard opens, the sidebar has two relevant menus:

1. System Management
2. System Tools

<img src="https://doc-image.zhangwj.com/img/genv1.0.0.png" width="300xp" />

### Importing the Table Structure

Open System Tools, go into `Code Generation`, and click `Import` on the page
below.

:::success
Importing brings the table you just created into the system, so code can be
generated from it.

:::

<img src="https://doc-image.zhangwj.com/img/genimport1v1.0.0.png" width="700xp" />

Select the `article` table you created earlier and click `Confirm` to import
its structure.

<img src="https://doc-image.zhangwj.com/img/genimport2v1.0.0.png" width="700xp" />

### Editing the Template Fields

Once confirmed, the table structure is stored in the generation tool — now
edit the imported data.

<img src="https://doc-image.zhangwj.com/img/genimport3v1.1.0.png" width="700xp" />

Edit the fields highlighted in red, then save.

<img src="https://doc-image.zhangwj.com/img/genimport4v1.0.0.png" width="700xp" />

### Previewing the Code

The preview shows the code the tool would generate.

<img src="https://doc-image.zhangwj.com/img/genimport5v1.0.0.png" width="700xp" />

### Generating the Code

Click `Code Generation` and the frontend and backend code get written into
`app/{application}/` and the frontend's configured `frontpath` respectively.

How the generated routes register by default (whether login or role
authorization is required) can change between versions — after generating,
it's worth opening the router file directly to check. The two registration
shapes are explained in [Router Registration](/en-US/intro/advanced/router).

Restart the frontend service, then move on to the page.

:::info
The screenshots are from an older release; the UI details may differ from the
current version, but the flow is the same.

:::
