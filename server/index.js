if (! ['staging', 'production'].includes(process.env.NODE_ENV)) {
  require('now-env')
}

const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, quiet: true })

const graphqlMiddleware = require('./graphql')

const handle = app.getRequestHandler()

async function init() {
  await app.prepare()

  const server = express()

  server.get('/', (req, res) => {
    return app.render(req, res, '/', {id: 'none'})
  })

  server.get('/requests/:id', (req, res) => {
    return app.render(req, res, '/', { id: req.params.id })
  })

  server.get('/_next/*', (req, res) => {
    return handle(req, res)
  })

  server.use('/graphql', graphqlMiddleware)

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
}

init().then(() => {
  // do nothing
}).catch(err => {
  console.error(err.stack)
  process.exit(1)
})
