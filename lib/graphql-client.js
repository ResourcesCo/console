import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const link = createHttpLink({
  uri: '/graphql',
  credentials: 'same-origin'
})

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

export default client