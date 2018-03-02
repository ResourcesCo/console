const ApiFunction = require('./api-function')

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
    return this.output
  }
}

module.exports = Request