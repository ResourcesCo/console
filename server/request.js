const ApiFunction = require('./api-function')
const aws = ApiFunction.findById('aws').fn

const pendingRequests = {}
const cachedRequests = []

class Request {
  constructor({id, input, functionId, output}) {
    this.id = id
    this.input = input
    this.functionId = functionId
    this.output = output
  }

  async send() {
    pendingRequests[this.id] = true
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
    cachedRequests.push(this)
    delete pendingRequests[this.id]
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
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `requests/${this.id}.json`,
      Body: JSON.stringify(data, null, 2)
    }
    await aws({
      service: 's3',
      method: 'putObject',
      params: saveParams
    }, {env: process.env})
  }

  toFlatJSON() {
    return {
      id: this.id,
      input: JSON.stringify(this.input, null, 2),
      functionId: this.functionId,
      output: JSON.stringify(this.output, null, 2)
    }
  }
}

Request.getById = async (id) => {
  const request = {
    service: 's3',
    method: 'getObject',
    params: {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `requests/${id}.json`
    }
  }
  const response = await aws(request, {env: process.env})
  const data = JSON.parse(response.Body)
  return new Request(data)
}

Request.findById = async (id) => {
  let result = cachedRequests.filter(request => request.id === id)[0]
  if (! result && id && id !== 'none' && !(id in pendingRequests)) {
    result = await Request.getById(id)
  }
  return result
}

module.exports = Request