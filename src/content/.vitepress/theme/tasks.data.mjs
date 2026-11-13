import { defineLoader } from 'vitepress'
import { readTasks } from '../../../../harness/tasks.mjs'
import repositories from '../../../../code/repositories.json' with { type: 'json' }

export default defineLoader({
  watch: ['../../../../harness/tasks/*.json', '../../../../code/repositories.json'],
  load() {
    return readTasks().map(task => ({
      ...task,
      repositoryName: repositories[task.repository].name,
      repositoryUrl: repositories[task.repository].url,
    }))
  },
})
