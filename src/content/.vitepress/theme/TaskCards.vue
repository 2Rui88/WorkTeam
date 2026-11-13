<script setup>
import { data as tasks } from './tasks.data.mjs'

const statuses = {
  planned: '待开始',
  in_progress: '进行中',
  pending_acceptance: '待验收',
  accepted: '已验收',
}
const outcomes = { passed: '通过', failed: '失败', not_run: '未运行' }
</script>

<template>
  <section v-for="task in tasks" :key="task.id" class="task-card" :aria-labelledby="task.id.toLowerCase()">
    <h3 :id="task.id.toLowerCase()">{{ task.id }} · {{ task.title }}</h3>
    <p class="task-meta">
      <span>{{ statuses[task.status] }}</span>
      <a :href="`${task.repositoryUrl}/tree/${task.revision}`">{{ task.repositoryName }} @ {{ task.revision.slice(0, 7) }}</a>
    </p>
    <ul>
      <li v-for="criterion in task.criteria" :key="criterion">{{ criterion }}</li>
    </ul>
    <p><strong>验证{{ outcomes[task.evidence.outcome] }}。</strong>{{ task.evidence.summary }}</p>
    <p v-if="task.evidence.environment">{{ task.evidence.environment }} · {{ task.evidence.date }}</p>
    <ul v-if="task.changes?.length" aria-label="变更记录">
      <li v-for="change in task.changes" :key="change">{{ change }}</li>
    </ul>
    <p><code>npm run task:verify -- {{ task.id }}</code></p>
    <p>{{ task.handoff }}</p>
    <p v-if="task.acceptance">验收人 {{ task.acceptance.reviewer }} · {{ task.acceptance.date }}</p>
    <p><a :href="`https://github.com/2Rui88/WorkTeam/blob/main/harness/tasks/${task.id}.json`">查看任务源文件</a></p>
  </section>
</template>

<style scoped>
.task-card {
  margin-block: 18px;
  padding: 0 20px 6px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
}
.task-meta { display: flex; flex-wrap: wrap; gap: 10px; align-items: baseline; }
.task-meta span {
  padding: 0 8px;
  border-radius: 5px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 650;
}
</style>
