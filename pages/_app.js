import App, {Container} from 'next/app'
import React from 'react'

import fetch from 'isomorphic-fetch'
if (!process.browser) {
  global.fetch = fetch
}
import graphqlClient from '../lib/graphql-client'
import { ApolloProvider } from 'react-apollo'

export default class ResourcesConsole extends App {
  static async getInitialProps ({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return {pageProps}
  }

  render () {
    const { Component, props, pageProps, hash, router } = this.props
    const url = createUrl(router)

    // If there no component exported we can't proceed.
    // We'll tackle that here.
    if (typeof Component !== 'function') {
      throw new Error(`The default export is not a React Component in page: "${url.pathname}"`)
    }
    const containerProps = { props, hash, router, url }

    return <ApolloProvider client={graphqlClient}>
      <Container>
        <Component {...pageProps} {...containerProps} />
      </Container>
    </ApolloProvider>
  }
}

function createUrl (router) {
  return {
    query: router.query,
    pathname: router.pathname,
    asPath: router.asPath,
    back: () => {
      warn(`Warning: 'url.back()' is deprecated. Use "window.history.back()"`)
      router.back()
    },
    push: (url, as) => {
      warn(`Warning: 'url.push()' is deprecated. Use "next/router" APIs.`)
      return router.push(url, as)
    },
    pushTo: (href, as) => {
      warn(`Warning: 'url.pushTo()' is deprecated. Use "next/router" APIs.`)
      const pushRoute = as ? href : null
      const pushUrl = as || href

      return router.push(pushRoute, pushUrl)
    },
    replace: (url, as) => {
      warn(`Warning: 'url.replace()' is deprecated. Use "next/router" APIs.`)
      return router.replace(url, as)
    },
    replaceTo: (href, as) => {
      warn(`Warning: 'url.replaceTo()' is deprecated. Use "next/router" APIs.`)
      const replaceRoute = as ? href : null
      const replaceUrl = as || href

      return router.replace(replaceRoute, replaceUrl)
    }
  }
}