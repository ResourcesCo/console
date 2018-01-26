import fetch from 'isomorphic-fetch'
if (!process.browser) {
  global.fetch = fetch
}
import graphqlClient from '../lib/graphql-client'
import { ApolloProvider } from 'react-apollo'
import App from './app'

export default () => (
  <ApolloProvider client={graphqlClient}>
    <App />
  </ApolloProvider>
)