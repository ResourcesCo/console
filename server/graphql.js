const expressGraphql = require('express-graphql')
const graphql = require('graphql')
const {readFileSync} = require('fs')
const {join, resolve} = require('path')

const requests = []

const functionValues = {
  'http-json': require('../functions/http-json'),
  mysql: require('../functions/http-json')
}

const functions = Object.keys(functionValues).map(id => (
  {
    id,
    name: id,
    source: readFileSync(join('functions', id, 'index.js')),
    example: readFileSync(join('functions', id, 'example.json'))
  }
))

const functionType = new graphql.GraphQLObjectType({
  name: 'Function',
  fields: {
    id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
    source: { type: graphql.GraphQLString },
    example: { type: graphql.GraphQLString }
  }
})

const requestType = new graphql.GraphQLObjectType({
  name: 'Request',
  fields: {
    id: { type: graphql.GraphQLID },
    functionId: { type: graphql.GraphQLString },
    input: { type: graphql.GraphQLString },
    output: { type: graphql.GraphQLString }
  }
})

const queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    function: {
      type: functionType,
      args: {
        id: { type: graphql.GraphQLID }
      },
      resolve: function (_, {id}) {
        return functions.filter(func => func.id === id)[0]
      }
    },
    allFunctions: {
      type: new graphql.GraphQLList(functionType),
      resolve: function (_, {id}) {
        return functions
      }
    },
    request: {
      type: requestType,
      args: {
        id: { type: graphql.GraphQLID }
      },
      resolve: function (_, {id}) {
        return requests.filter(request => request.id === id)[0] || { id }
      }
    }
  }
})

function delay(milliseconds) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, milliseconds)
  })
}

const mutationType = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createRequest: {
      type: requestType,
      args: {
        id: { type: graphql.GraphQLID },
        input: { type: graphql.GraphQLString },
        functionId: { type: graphql.GraphQLString }
      },
      resolve: async (_, {id, input, functionId}) => {
        await delay(1000)
        const fn = functionValues[functionId]
        const output = await fn(JSON.parse(input))
        const request = {
          id,
          input,
          functionId,
          output: JSON.stringify(output, null, 2)
        }
        requests.push(request)
        return request
      }
    }
  }
})

const schema = new graphql.GraphQLSchema({query: queryType, mutation: mutationType})

module.exports = expressGraphql({
  schema,
  graphiql: true
})