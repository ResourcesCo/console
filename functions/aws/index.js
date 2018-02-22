const {promisify} = require('util')

module.exports = async (input, {env}) => {
  const { inputFilters, outputFilters, ...inputData } = input
  const filteredInput = inputFilters ? applyFilters(inputData, inputFilters) : inputData
  const output = await request(filteredInput, {env})
  return outputFilters ? applyFilters(output, outputFilters) : output
}

const request = async ({ service, method, params, ...opts }, {env}) => {
  const { outputFilters, envPrefix, serviceParams } = opts
  const klass = require(`aws-sdk/clients/${service}`)
  const serviceObject = new klass(getServiceParams({serviceParams, envPrefix, env}))
  const methodFn = serviceObject[method]
  if (!methodFn) {
    throw new Error(`Cannot find method: ${method}`)
  }
  const methodPromised = promisify(methodFn.bind(serviceObject))
  const output = await methodPromised(params)
  return output
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
  const envSep = (envPrefix || '').endsWith('_') ? '' : '_'
  const fullEnvPrefix = (envPrefix && envPrefix.length) ? `${envPrefix}${envSep}` : ''
  const res = {}
  Object.entries(credentials).forEach(([key, envVariable]) => {
    const value = env[`${fullEnvPrefix}${envVariable}`]
    if (value) {
      res[key] = value
    }
  })
  permittedServiceParams.forEach(key => {
    if (serviceParams && key in serviceParams) {
      res[key] = serviceParams[key]
    }
  })
  if (! (res.accessKeyId && res.secretAccessKey) || res.sessionToken) {
    const envPrefixMessage = envPrefix && ` with envPrefix: '${envPrefix}'`
    throw new Error(`Cannot not find AWS credentials${envPrefixMessage || ''}`)
  }
  return res
}

const filterFunctions = {
  format: (value, {type}) => {
    return JSON.stringify(value, null, 2)
  },
  parse: (value, {type}) => {
    if (type !== 'json') {
      throw new Error(`Don't know how to parse type: '${type}'`)
    }
    try {
      return JSON.parse(value)
    } catch (e) {
      throw new Error(`Error parsing JSON: '${value}'`)
    }
  }
}

const applyFilters = (data, filterSpecs) => {
  let filteredData = data
  filterSpecs.forEach(filterSpec => {
    const {filter, path, ...opts} = filterSpec
    const filterFn = filterFunctions[filter]
    if (typeof filterFn !== 'function') {
      throw new Error(`Cannot find filter function: '${filter}'`)
    }
    const pathArr = Array.isArray(path) ? path : (path || '').split('.')
    if (pathArr.length === 0) {
      filteredData = filterFn(value, opts)
    } else {
      let parent = filteredData
      for (let i=0; i < pathArr.length - 1; i++) {
        parent = parent[pathArr[i]]
      }
      const key = pathArr[pathArr.length - 1]
      parent[key] = filterFn(parent[key], opts)
    }
  })
  return filteredData
}