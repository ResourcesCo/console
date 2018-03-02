class Request {
  constructor({id, input, fn}) {
    this.id = id
    this.input = input
    this.fn = fn
    this.output = null
  }

  async send() {
    try {
      this.output = await this.fn(this.input, {env: process.env})
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