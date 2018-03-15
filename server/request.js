const ApiFunction = require('./api-function')
const config = require('../config.json')

class Request {
  constructor({id, input, functionId}) {
    this.id = id
    this.input = input
    this.functionId = functionId
    this.output = null
  }

  async send() {
    const fn = ApiFunction.findById(this.functionId).fn
    try {
      this.output = await fn(this.input, {env: process.env})
    } catch (err) {
      this.output = {
        error: err.toString(),
        stack: err.stack.split("\n")
      }
    }
    try {
      await this.save()
    } catch (err) {
      this.output = {
        output: this.output,
        saveError: err.toString(),
        saveErrorStack: err.stack.split("\n")
      }
    }
    return this.output
  }

  async save() {
    const data = {
      id: this.id,
      input: this.input,
      functionId: this.functionId,
      input: this.input,
      output: this.output
    }
    const saveParams = {
      ContentType: 'application/json',
      Bucket: config.console.dataStore.bucket,
      Key: `requests/${this.id}.json`,
      Body: JSON.stringify(data, null, 2)
    }
    const aws = ApiFunction.findById('aws').fn
    await aws({
      service: 's3',
      method: 'putObject',
      params: saveParams,
      envPrefix: config.console.dataStore.envPrefix
    }, {env: process.env})
  }
}

module.exports = Request