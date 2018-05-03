const expressGraphql = require('express-graphql')
const graphql = require('graphql')
const ApiFunction = require('./api-function')
const Request = require('./request')

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

const requestSummaryType = new graphql.GraphQLObjectType({
  name: 'RequestSummary',
  fields: {
    id: { type: graphql.GraphQLID }
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
      resolve: (_, {id}) => {
        return ApiFunction.findById(id)
      }
    },
    functions: {
      type: new graphql.GraphQLList(functionType),
      resolve: async (_, {id}) => {
        return await ApiFunction.list()
      }
    },
    request: {
      type: requestType,
      args: {
        id: { type: graphql.GraphQLID }
      },
      resolve: async (_, {id}) => {
        const request = await Request.findById(id)
        return request ? request.toFlatJSON() : { id }
      }
    },
    requests: {
      type: new graphql.GraphQLList(requestSummaryType),
      resolve: async (_) => {
        return await Request.list()
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
        const parsedInput = JSON.parse(input)
        const request = new Request({
          id,
          input: parsedInput,
          functionId
        })
        const output = await request.send()
        return request.toFlatJSON()
      }
    }
  }
})

const schema = new graphql.GraphQLSchema({query: queryType, mutation: mutationType})

module.exports = expressGraphql({
  schema,
  graphiql: true
})