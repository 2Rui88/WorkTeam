import Ajv from 'ajv'
import schema from './projects.schema.json' with { type: 'json' }
import repositories from './repositories.json' with { type: 'json' }
import roles from '../harness/roles.json' with { type: 'json' }

const validate = new Ajv({ allErrors: true }).compile(schema)

export function configErrors(config) {
  if (!validate(config)) {
    return validate.errors.map(({ instancePath, message }) => `${instancePath || '/'} ${message}`)
  }
  return [
    ...config.roles.filter(id => !Object.hasOwn(roles, id)).map(id => `未知角色：${id}`),
    ...Object.keys(config.repositories)
      .filter(id => !Object.hasOwn(repositories, id))
      .map(id => `未知仓库：${id}`),
  ]
}
