const expressGraphql = require('express-graphql')
const graphql = require('graphql')
const {readFileSync} = require('fs')
const {join, resolve} = require('path')

const functions = ['http-json', 'mysql'].map(name => (
  {
    name,
    source: readFileSync(join('functions', name, 'index.js')),
    example: readFileSync(join('functions', name, 'example.json'))
  }
))

const functionType = new graphql.GraphQLObjectType({
  name: 'Function',
  fields: {
    name: { type: graphql.GraphQLString },
    source: { type: graphql.GraphQLString },
    example: { type: graphql.GraphQLString }
  }
})

const queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    function: {
      type: functionType,
      args: {
        name: { type: graphql.GraphQLString }
      },
      resolve: function (_, {name}) {
        return functions.filter(func => func.name === name)[0]
      }
    },
    allFunctions: {
      type: new graphql.GraphQLList(functionType),
      args: {
        id: { type: graphql.GraphQLString }
      },
      resolve: function (_, {id}) {
        return functions
      }
    }
  }
})

const schema = new graphql.GraphQLSchema({query: queryType})

const rootValue = {
  getFunction: () => ('Hello, world!')
}

module.exports = expressGraphql({
  schema,
  rootValue,
  graphiql: true
})