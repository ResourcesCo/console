const {promisify} = require('util')

module.exports = async function request(params) {
  try {
    const serviceClass = require(`aws-sdk/clients/${params.service}`)
    const service = new serviceClass(params.serviceParams)
    const method = promisify(service[params.method].bind(service))
    const methodParams = {}
    for (let key of Object.keys(params)) {
      if (!['service', 'serviceParams', 'method'].includes(key)) {
        methodParams[key] = params[key]
      }
    }
    return await method(methodParams)
  } catch (err) {
    return { error: err.toString() }
  }
}