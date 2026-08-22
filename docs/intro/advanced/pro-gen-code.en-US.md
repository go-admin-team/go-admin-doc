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
title: Code Generation Tool
order: 12
toc: content
description: How to use the code generation tool that ships with go-admin-pro, for the Ant Design Pro frontend.
keywords: [go-admin-pro code generation, antd pro code generation]
---

### Using the Code Tool

:::info
"Agent" on this page refers to go-admin-pro code generation platform's local client program, which writes code generated on the online platform into your local project — it has nothing to do with LLMs. For generating business code with an LLM, see [Generating Code with an LLM](/en-US/intro/advanced/ai-gen-code).

:::

#### Starting the Agent

1. It's recommended to place the launcher script in the same directory as your project; the script file itself needs to be obtained from the site owner.

![agent](https://doc-image.zhangwj.com/img/pro-gen-code-agent.png)

2. Pick the one matching your machine.
3. `chmod +x go-admin-agent-darwin-amd64`
4. `./go-admin-agent-darwin-amd64 -p 9999 -a xxx-xxx-xxxx-xxx` — the authorization code can be found under the code generation platform's personal center at https://vip.go-admin.pro/user/login, as shown below.
5. ![personal center](https://doc-image.zhangwj.com/img/pro-gen-code-usercenter.png)

6. ![agent_success](https://doc-image.zhangwj.com/img/pro-gen-code-agent_success.png)

7. That means it started successfully.

#### Preparation

##### Table Schema

1. Add online

2. Import SQL

3. Import JSON

Click the corresponding entry point — each one has its own instructions; follow the prompts to import.

##### Database Field Attributes

**Worth calling out: for the default fields `created_at`, `updated_at`, `deleted_at`, choose `string` — there's no need to pick `time.Time`.**

![database attributes](https://doc-image.zhangwj.com/img/pro-gen-code-dbconfig.png)

##### Page Attributes

![page attributes](https://doc-image.zhangwj.com/img/pro-gen-code-pageconfig.png)

**Worth calling out on the dropdown: if the dropdown's options come from a dictionary and you want the page to render the dictionary content dynamically, you also need to set this in the module config, as shown below.**

![dropdown settings](https://doc-image.zhangwj.com/img/pro-gen-code-dropdownlist.png)

​ The system uses this key to automatically call the dictionary endpoint on the page — the image below shows the dictionary settings.

![dictionary settings](https://doc-image.zhangwj.com/img/pro-gen-code-dictconfig.png)

##### Configuration

1. Displaying a field from a related table needs table association configured. Say you have two tables — a `products` table and a `skus` table — and you want the `skus` table to display the product name from `products`. In SQL that's: `select a.pro_id, b.name from skus as a join products as b on a.pro_id = b.code`, where `a.pro_id` and `b.code` are the join condition. To show `products.name` on the `skus` table, configure it as shown below.

![configuration](https://doc-image.zhangwj.com/img/pro-gen-code-config-1.png)

2. If it's a cross-app relation, note the generated import — `import { b } from "../b/service";` — and adjust the relative path between `b` and `a`.

##### Field Validation

The current rules are fairly simple, mainly setting whether a field is required.

##### Generation Info

![generation info](https://doc-image.zhangwj.com/img/pro-gen-code-info.png)

1. The agent tool's path relative to the project — since it's in the same directory as described above, `./` is enough.

2. The frontend and backend project folders — just enter the actual folder names of your project.

#### Generating Code

![tools](https://doc-image.zhangwj.com/img/pro-gen-code-tools.png)

Click **_..._** in the row for the table you want, and choose to generate via the agent.

##### Generate via Agent (the important one)

​ Once the agent is running and the table design is configured, click generate-via-agent and the code is written straight into your project.

##### Code Download

​ There's an option to download the generated files, but with everything generated automatically online now, it's rarely needed.

##### Code Preview (the important one)

​ Before generating, you can preview the code that will come out, so you can catch and fix mistakes early. Later, if you add a field but don't want to regenerate everything and risk overwriting business code, the preview is handy too — pull up the classic programmer move, copy and paste, and drop the change straight into the relevant file.

##### SQL Preview

You can use the previewed SQL directly, copying it into the database to run.

##### Access Preview (the important one)

​ This is for frontend project permissions. As a project matures, permission management becomes worth doing properly — it appends to `src/access.ts`; find the file and do the copy-paste move.

##### Routes Preview (the important one)

​ In the frontend Ant Design project, routes and system menus are two different concepts, and routes need to be configured too — it appends to `configs/routes.ts`. You'll likely need to adjust it to fit your actual scenario, since in many cases several tables belong to a small number of apps, and the routes need merging within the same app.

##### Multi-Language Preview (the important one)

​ The project currently supports Chinese and English — this appends content to `src/locales/zh-CN/menu.ts` and `src/locales/zh-CN/pages.ts`. If the auto-generated content doesn't pick something up correctly, open your browser's dev tools and check the console for the error, then fix it by hand.

#### Custom Forms (in development)

Notes:

1. Every input field you add needs a corresponding mapping key filled in, or you can't add further fields.

2. Dropdowns support fetching dynamic data from a backend endpoint.

3. The `Group` layout component lets you adjust the input layout by resizing elements.

4. Live preview is supported.

![form](https://doc-image.zhangwj.com/img/pro-gen-code-form.png)
