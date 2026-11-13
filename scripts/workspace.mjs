import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, readFileSync, realpathSync, statSync, constants } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { configErrors } from '../code/config.mjs'
import repositories from '../code/repositories.json' with { type: 'json' }
import roles from '../harness/roles.json' with { type: 'json' }

const root = fileURLToPath(new URL('../', import.meta.url))
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
  const changes = git('status', '--porcelain') ? '有本地改动' : '工作区干净'
  console.log(`✓ ${id} @ ${git('rev-parse', 'HEAD')}（${changes}）\n  ${path}`)
}

function check() {
  if (!existsSync(localFile)) throw new Error('缺少本地配置，请先运行 npm run workspace:init。')
  const config = JSON.parse(readFileSync(localFile, 'utf8').replace(/^\uFEFF/, ''))
  const errors = configErrors(config)
  if (errors.length) throw new Error(errors.join('\n'))
  for (const [id, path] of Object.entries(config.repositories)) checkRepository(id, path)
  console.log(`角色：${config.roles.map(id => roles[id].label).join('、')}`)
}

try {
  switch (process.argv[2]) {
    case 'init': init(); break
    case 'check': check(); break
    default: throw new Error('用法：node scripts/workspace.mjs <init|check>')
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
