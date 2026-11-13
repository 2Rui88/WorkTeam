# WorkTeam Agent 指南

WorkTeam 是项目知识和交付记录所在的仓库。业务代码通过 `code/projects.local.json` 映射到独立的 Git 仓库。

## 接手任务

1. 用 `npm run task:show -- WT-001` 查看任务。使用实际任务 ID 替换示例 ID，阅读任务引用的需求、范围和验收项。
2. 涉及业务仓时，运行 `npm run workspace:check`，检查仓库位置、提交和工作区状态。进入业务仓后读取其中适用的指令文件，并保留已有的工作区修改。
3. 通过 `harness/roles.json` 找到适用角色和 Skill。任务范围以任务记录和用户指令为准。若验收条件有歧义，先记录待决定项。
4. 在任务中记录代码 PR 或提交、涉及的文档，以及验收命令、实际结果、验证环境和验证提交。业务行为变化时，在同一任务更新对应知识。
5. 提交验收前运行 `npm run task:check` 和 `npm run build`，并按任务执行业务验证。把通过验证的任务交接为 `pending_acceptance`。确认验收后记录评审人和日期，再更新为 `accepted`。

任务模板见 `harness/templates/task.json`。流程说明见 `src/content/guide/tasks.md`。
