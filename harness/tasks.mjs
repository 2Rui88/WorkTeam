import { readFileSync, readdirSync, realpathSync, statSync } from 'node:fs'
import { isAbsolute, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv from 'ajv'
import schema from './task.schema.json' with { type: 'json' }
import repositories from '../code/repositories.json' with { type: 'json' }
import roles from './roles.json' with { type: 'json' }

export const workspaceRoot = fileURLToPath(new URL('../', import.meta.url))
const directory = new URL('./tasks/', import.meta.url)
const ajv = new Ajv({ allErrors: true })
const validate = ajv.compile(schema)

export function isWithin(root, path) {
  const rel = relative(root, path)
  return !isAbsolute(rel) && rel !== '..' && !rel.startsWith(`..${sep}`)
}

function verifyReference(path) {
  const target = resolve(workspaceRoot, path)
  if (!isWithin(workspaceRoot, target) || !statSync(target, { throwIfNoEntry: false })?.isFile()) {
    throw new Error(`找不到 Workspace 引用：${path}`)
  }
  if (!isWithin(realpathSync(workspaceRoot), realpathSync(target))) {
    throw new Error(`引用指向 Workspace 之外：${path}`)
  }
}

export function readTasks() {
  for (const role of Object.values(roles)) verifyReference(role.skill)
  return readdirSync(directory).filter(name => name.endsWith('.json')).sort().map(name => {
    try {
      const task = JSON.parse(readFileSync(new URL(name, directory), 'utf8'))
      if (!validate(task)) throw new Error(ajv.errorsText(validate.errors))
      if (name !== `${task.id}.json`) throw new Error('文件名必须与任务 ID 一致。')
      if (!Object.hasOwn(repositories, task.repository)) throw new Error(`未知仓库：${task.repository}`)
      for (const reference of task.references) verifyReference(reference)
      return task
    } catch (error) {
      throw new Error(`${name}: ${error.message}`)
    }
  })
}

export function taskById(id) {
  const task = readTasks().find(entry => entry.id === id)
  if (!task) throw new Error(`找不到任务：${id || '请提供任务 ID'}`)
  return task
}
