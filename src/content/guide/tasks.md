# 任务验收

<script setup>
import TaskCards from '../.vitepress/theme/TaskCards.vue'
</script>

任务记录把需求、代码版本、验证和交接串在一起。团队通过网页查看，Agent 可以从根目录的 `AGENTS.md` 找到同一份记录。

## 示例 WT-001

从 [文件助手工具注册](../example/tool-registry.md) 阅读需求和技术入口。

<TaskCards />

## 重跑验收

使用已安装业务依赖与 pytest 的 Python 环境。业务依赖见示例仓的 `backend/requirements.txt`。基线验证使用 Python 3.11 和 pytest 8.3.4。

如果现有业务仓正在开发，可以在 WorkTeam 中创建独立检出。从 WorkTeam 根目录运行：

```sh
git clone https://github.com/2Rui88/AI_CunChu_Agent.git .workteam/AI_CunChu_Agent
git -C .workteam/AI_CunChu_Agent checkout --detach 4103c22c4578604bfc2b14f5f9f85b816c5e0396
```

将 `code/projects.local.json` 中 `ai-cunchu-agent` 的路径设为 `.workteam/AI_CunChu_Agent`，然后执行：

```sh
npm run workspace:check
npm run task:check
npm run task:show -- WT-001
npm run task:verify -- WT-001
```

验证命令从任务记录读取，在匹配提交的干净检出里执行。运行前可通过 `task:show` 核对命令和目标版本。

## 新建与交接任务

1. 复制 `harness/templates/task.json` 到 `harness/tasks/`，填入唯一任务 ID、实际代码版本、文档引用、范围、验收条件和验证命令。文件名与任务 ID 对应。
2. 开始后将状态设为 `in_progress`。实现变更时在 `changes` 中链接相关 PR 或提交，并同步受影响的知识。
3. 记录真实的验证结果、环境和日期。验证通过后填写交接内容，并设为 `pending_acceptance`。
4. 评审通过后，填入 `acceptance.reviewer` 和 `acceptance.date`，状态改为 `accepted`。运行 `npm run task:check` 后提交任务记录。
