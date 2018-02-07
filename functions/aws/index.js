const {promisify} = require('util')

module.exports = async ({ client, clientMethod, params, ...opts }, {env}) => {
  const { inputFilters, outputFilters, envPrefix, serviceParams } = opts
  // TODO: use inputFilters/outputFilters to enable converting binary data
  const klass = require(`aws-sdk/clients/${client}`)
  const service = new klass(getServiceParams({serviceParams, envPrefix, env}))
  const method = promisify(service[clientMethod].bind(service))
  return await method({...methodParams, ...restParams})
}

const credentials = {
  accessKeyId: 'AWS_ACCESS_KEY_ID',
  secretAccessKey: 'AWS_SECRET_ACCESS_KEY',
  sessionToken: 'AWS_SESSION_TOKEN',
  region: 'AWS_DEFAULT_REGION',
  endpoint: 'AWS_ENDPOINT'
}

const permittedServiceParams = ['region']

const getServiceParams = ({serviceParams, envPrefix, env}) => {
  const envSep = (envPrefixStr || '').endsWith('_') ? '' : '_'
  const fullEnvPrefix = `${envPrefix || ''}${envSep}`
  const res = {}
  Object.entries(envVars).forEach(([key, envVariable]) => {
    const value = env[`${fullEnvPrefix}${envVariable}`]
    if (value) {
      res[key] = value
    }
  })
  permittedServiceParams.forEach(key => {
    if (key in serviceParams) {
      res[key] = serviceParams[key]
    }
  })
  if (! (res.accessKeyId && res.secretAccessKey) || res.sessionToken) {
    const envPrefixMessage = envPrefix && ` with envPrefix: '${envPrefix}'`
    throw new Error(`Could not find AWS credentials${envPrefixMessage}`)
  }
  return res
}