# WorkTeam

WorkTeam 是团队与 Agent 共用的研发工作空间。站点从 Git 中的 Markdown 构建，示例项目为 [AI_CunChu_Agent](https://github.com/2Rui88/AI_CunChu_Agent)。

## 本地运行

需要 Node.js 22 或更高版本，以及 Git。

```sh
npm ci
npm run dev
```

打开终端输出的本地地址。运行 `npm run build` 生成静态站点，运行 `npm run preview` 预览构建结果。Windows PowerShell 如限制执行 npm 的脚本入口，可使用 `npm.cmd` 执行相同命令。

## 文档

在 `src/content/` 维护项目文档。从 [开始阅读](src/content/guide/index.md) 进入，或查看 [AI 云存储示例](src/content/example/index.md)。

## 接入业务仓

如果本地已有 `AI_CunChu_Agent`，直接使用已有检出。否则从 WorkTeam 根目录运行：

```sh
git clone https://github.com/2Rui88/AI_CunChu_Agent.git ../AI_CunChu_Agent
```

```sh
npm run workspace:init
npm run workspace:check
```

如检出位置不同，修改 `code/projects.local.json` 中的路径，或使用站点的「仓库配置」页面生成文件。详细步骤见 [仓库配置](src/content/guide/repositories.md)。

## 用任务 ID 接手

```sh
npm run task:check
npm run task:show -- WT-001
npm run task:verify -- WT-001
```

[WT-001](harness/tasks/WT-001.json) 使用 AI_CunChu_Agent 的工具注册测试演示需求、代码、验证证据与交接。重跑业务测试需要对应基线的干净检出与 Python 依赖，见 [任务验收](src/content/guide/tasks.md)。Agent 从 [AGENTS.md](AGENTS.md) 开始。
