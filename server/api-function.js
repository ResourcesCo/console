const {readFileSync} = require('fs')
const {join, resolve} = require('path')

class ApiFunction {
}

ApiFunction.list = () => {
  return functions
}

ApiFunction.findById = (id) => {
  return functions.filter(func => func.id === id)[0]
}

const functionValues = {
  http: require('../functions/http'),
  aws: require('../functions/aws')
}

const functions = Object.keys(functionValues).map(id => (
  {
    id,
    name: id,
    source: readFileSync(join('functions', id, 'index.js')),
    example: readFileSync(join('functions', id, 'example.json')),
    fn: functionValues[id]
  }
))

module.exports = ApiFunction