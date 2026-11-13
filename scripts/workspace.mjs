import { execFileSync, spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, readFileSync, realpathSync, statSync, constants } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { configErrors } from '../code/config.mjs'
import repositories from '../code/repositories.json' with { type: 'json' }
import roles from '../harness/roles.json' with { type: 'json' }
import { isWithin, readTasks, taskById, workspaceRoot as root } from '../harness/tasks.mjs'

const localFile = join(root, 'code/projects.local.json')

function init() {
  try {
    copyFileSync(join(root, 'code/projects.example.json'), localFile, constants.COPYFILE_EXCL)
    console.log('已创建 code/projects.local.json。请确认仓库路径与角色。')
  } catch (error) {
    if (error.code !== 'EEXIST') throw error
    console.log('code/projects.local.json 已存在。')
  }
}

function repositoryIdentity(url) {
  return url
    .replace(/^(?:https?:\/\/|ssh:\/\/(?:git@)?|git@)/i, '')
    .replace(/^github\.com:/i, 'github.com/')
    .replace(/\/$/, '')
    .replace(/\.git$/i, '')
    .toLowerCase()
}

function checkRepository(id, configuredPath) {
  const path = /^~[/\\]/.test(configuredPath)
    ? resolve(homedir(), configuredPath.slice(2))
    : resolve(root, configuredPath)
  if (!existsSync(path) || !statSync(path).isDirectory()) {
    throw new Error(`${id} 目录不存在：${path}`)
  }
  const git = (...args) => execFileSync('git', ['-C', path, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
  let top
  let origin
  try {
    top = git('rev-parse', '--show-toplevel')
    origin = git('remote', 'get-url', 'origin')
  } catch {
    throw new Error(`${id} 需要一个带 origin 的 Git 仓库：${path}`)
  }
  if (realpathSync(top) !== realpathSync(path)) {
    throw new Error(`${id} 请登记仓库根目录：${top}`)
  }
  if (repositoryIdentity(origin) !== repositoryIdentity(repositories[id].url)) {
    throw new Error(`${id} 的 origin 与 code/repositories.json 不匹配。`)
  }
  for (const module of repositories[id].modules) {
    const directory = join(path, module)
    if (!existsSync(directory) || !statSync(directory).isDirectory()) {
      throw new Error(`${id} 缺少模块目录：${module}`)
    }
  }
  return { path, revision: git('rev-parse', 'HEAD'), dirty: Boolean(git('status', '--porcelain')) }
}

function readConfig() {
  if (!existsSync(localFile)) throw new Error('缺少本地配置，请先运行 npm run workspace:init。')
  const config = JSON.parse(readFileSync(localFile, 'utf8').replace(/^\uFEFF/, ''))
  const errors = configErrors(config)
  if (errors.length) throw new Error(errors.join('\n'))
  return config
}

function check() {
  const config = readConfig()
  for (const [id, configuredPath] of Object.entries(config.repositories)) {
    const { path, revision, dirty } = checkRepository(id, configuredPath)
    console.log(`✓ ${id} @ ${revision}（${dirty ? '有本地改动' : '工作区干净'}）\n  ${path}`)
  }
  console.log(`角色：${config.roles.map(id => roles[id].label).join('、')}`)
}

function verifyTask(id) {
  const task = taskById(id)
  const config = readConfig()
  const configuredPath = config.repositories[task.repository]
  if (!configuredPath) throw new Error(`请先登记任务使用的仓库：${task.repository}`)
  const { path, revision, dirty } = checkRepository(task.repository, configuredPath)
  if (revision !== task.revision || dirty) {
    throw new Error(`请将本地配置指向 ${task.revision} 的干净检出。当前 HEAD：${revision}，${dirty ? '有本地改动' : '工作区干净'}。`)
  }
  for (const item of [...task.scope, task.command.cwd]) {
    const target = resolve(path, item)
    if (!isWithin(path, target) || !existsSync(target) || !isWithin(realpathSync(path), realpathSync(target))) {
      throw new Error(`任务路径无效：${item}`)
    }
  }
  const { program, args, cwd } = task.command
  console.log(`${task.id} @ ${revision}\n${cwd}> ${[program, ...args].join(' ')}`)
  const result = spawnSync(program, args, { cwd: resolve(path, cwd), stdio: 'inherit' })
  if (result.error) throw new Error(`无法启动 ${program}：${result.error.message}`)
  if (result.status !== 0) throw new Error(`${id} 验证失败（${result.status ?? result.signal}）。`)
  const after = checkRepository(task.repository, configuredPath)
  if (after.revision !== revision || after.dirty) throw new Error('验证期间工作区状态发生变化，请复核结果。')
  console.log(`${id} 验证通过。请复核输出并将本次证据写入任务记录。`)
}

try {
  switch (process.argv[2]) {
    case 'init': init(); break
    case 'check': check(); break
    case 'task-check': console.log(`✓ ${readTasks().length} 条任务记录与角色引用通过校验。`); break
    case 'task-show': console.log(JSON.stringify(taskById(process.argv[3]), null, 2)); break
    case 'task-verify': verifyTask(process.argv[3]); break
    default: throw new Error('用法：node scripts/workspace.mjs <init|check|task-check|task-show|task-verify>')
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
