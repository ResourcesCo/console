const expressGraphql = require('express-graphql')
const graphql = require('graphql')
const {interpolate} = require('../lib/interpolation')
const ApiFunction = require('./api-function')
const Request = require('./request')

const requests = []

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
        return ApiFunction.findById(id)
      }
    },
    allFunctions: {
      type: new graphql.GraphQLList(functionType),
      resolve: function (_, {id}) {
        return ApiFunction.all()
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
        await delay(200)
        const parsedInput = JSON.parse(input)
        const request = new Request({
          id,
          input: parsedInput,
          functionId
        })
        const output = await request.send()
        requests.push(request)
        return {
          id: request.id,
          input: request.input,
          functionId: request.functionId,
          output: JSON.stringify(request.output, null, 2)
        }
      }
    }
  }
})

const schema = new graphql.GraphQLSchema({query: queryType, mutation: mutationType})

module.exports = expressGraphql({
  schema,
  graphiql: true
})