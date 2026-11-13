<script setup>
import { computed, ref } from 'vue'
import { configErrors } from '../../../../code/config.mjs'
import example from '../../../../code/projects.example.json'
import repositories from '../../../../code/repositories.json'
import roles from '../../../../harness/roles.json'

const config = ref(structuredClone(example))
const message = ref('')
const errors = computed(() => configErrors(config.value))
const paths = computed(() => config.value.roles.flatMap(id => roles[id].paths))

async function importConfig(event) {
  const input = event.target
  const file = input.files?.[0]
  if (!file) return
  try {
    const candidate = JSON.parse((await file.text()).replace(/^\uFEFF/, ''))
    const issues = configErrors(candidate)
    if (issues.length) throw new Error(issues.join('；'))
    config.value = candidate
    message.value = '已载入本地配置。'
  } catch (error) {
    message.value = `导入失败：${error.message}`
  } finally {
    input.value = ''
  }
}

function exportConfig() {
  const content = JSON.stringify({ ...config.value, $schema: example.$schema }, null, 2) + '\n'
  const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'projects.local.json'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  message.value = '配置已导出，请将文件放到 code/projects.local.json。'
}
</script>

<template>
  <form class="repository-settings" @submit.prevent="exportConfig">
    <fieldset>
      <legend>业务仓库</legend>
      <div v-for="(repository, id) in repositories" :key="id" class="repository-field">
        <a :href="repository.url">{{ repository.name }}</a>
        <label :for="`path-${id}`">本机路径</label>
        <input :id="`path-${id}`" v-model="config.repositories[id]" type="text" required spellcheck="false">
      </div>
    </fieldset>
    <fieldset>
      <legend>我的角色</legend>
      <div class="role-options">
        <label v-for="(role, id) in roles" :key="id">
          <input v-model="config.roles" type="checkbox" :value="id">
          {{ role.label }}
        </label>
      </div>
      <ul v-if="paths.length" class="role-paths" aria-label="角色负责目录">
        <li v-for="path in [...new Set(paths)]" :key="path"><code>{{ path }}</code></li>
      </ul>
    </fieldset>
    <div class="config-actions">
      <label for="import-config">导入 JSON</label>
      <input id="import-config" type="file" accept=".json,application/json" @change="importConfig">
      <button type="submit" :disabled="errors.length > 0">导出本地配置</button>
    </div>
    <p v-if="errors.length" class="config-message">请选择至少一个角色，并填写有效的本机路径。</p>
    <p class="config-message" role="status">{{ message }}</p>
  </form>
</template>

<style scoped>
.repository-settings {
  display: grid;
  gap: 16px;
  margin: 16px 0 24px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.repository-settings fieldset {
  min-width: 0;
  display: grid;
  gap: 8px;
}

.repository-settings legend {
  padding-bottom: 6px;
  font-weight: 650;
}

.repository-field {
  display: grid;
  gap: 4px;
}

.repository-field label,
.config-message {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.repository-field input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  font-family: var(--vp-font-family-mono);
}

.role-options, .config-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.role-options label { display: inline-flex; align-items: center; gap: 6px; }
.role-paths { margin: 0; overflow-wrap: anywhere; }
.config-message { margin: 0; overflow-wrap: anywhere; }
.config-message:empty { display: none; }
.config-actions input { max-width: 100%; }
.config-actions input::file-selector-button {
  margin-right: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  padding: 3px 8px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
}

.config-actions button {
  padding: 6px 12px;
  border-radius: 6px;
  background: var(--vp-c-brand-3);
  color: white;
  font-weight: 650;
}

.config-actions button:disabled { opacity: .55; }
</style>
