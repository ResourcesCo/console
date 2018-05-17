const ApiFunction = require('./api-function')
const AWS = require('aws-sdk')
const BlobCollection = require('blob-collection')
const lruCache = require('lru-cache')

const s3Config = Object.assign(
  {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }, process.env.AWS_REGION ? {
    region: process.env.AWS_REGION
  } : {},
  process.env.AWS_ENDPOINT ? {
    endpoint: process.env.AWS_ENDPOINT,
    s3ForcePathStyle: true
  } : {}
)
const client = new AWS.S3(s3Config)
const collection = new BlobCollection({
  client,
  bucket: process.env.AWS_S3_BUCKET,
  prefix: 'requests/',
  view: {
    map: doc => {
      if (doc.functionId === 'http') {
        return {
          user: doc.createdBy.username,
          method: doc.input.method,
          url: doc.input.url
        }
      } else if (doc.functionId === 'aws') {
        return {
          user: doc.createdBy.username,
          service: doc.input.service,
          method: doc.input.method
        }
      }
    }
  }
})

const pendingRequestIds = {}
const recentRequestCache = lruCache({max: 5})
const recentRequestSummaryCache = lruCache({max: 500})

class Request {
  constructor({id, createdBy, input, functionId, output}) {
    this.id = id
    this.createdBy = createdBy
    this.input = input
    this.functionId = functionId
    this.output = output
  }

  async send() {
    // TODO: write unique summary files w/ underscore's debounce + maxWait
    pendingRequestIds[this.id] = true
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
    recentRequestCache.set(this.id, this)
    delete pendingRequestIds[this.id]
    return this.output
  }

  async save() {
    const doc = {
      _id: this.id,
      createdBy: this.createdBy,
      input: this.input,
      functionId: this.functionId,
      input: this.input,
      output: this.output
    }
    await collection.put(doc)
  }

  toFlatJSON() {
    return {
      id: this.id,
      createdBy: this.createdBy,
      input: JSON.stringify(this.input, null, 2),
      functionId: this.functionId,
      output: JSON.stringify(this.output, null, 2)
    }
  }
}

Request.getById = async (id) => {
  const data = await collection.get(id)
  const {_id, ...rest} = data
  return new Request({id: _id, ...rest})
}

Request.findById = async (id) => {
  let result = recentRequestCache.get(id)
  if (! result && id && !(id in pendingRequestIds)) {
    result = await Request.getById(id)
  }
  return result
}

Request.list = async (before = null, count = 100) => {
  return await collection.list(before, count)
}

module.exports = Request