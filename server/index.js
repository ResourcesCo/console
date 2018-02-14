if (! ['staging', 'production'].includes(process.env.NODE_ENV)) {
  require('now-env')
}

const express = require('express')
const next = require('next')

const NoAuth = require('./auth/no-auth')
const AccessCodeAuth = require('./auth/access-code-auth')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, quiet: true })

const graphqlMiddleware = require('./graphql')

const handle = app.getRequestHandler()

let auth
if (process.env !== 'production' && process.env !== 'staging' && !process.env.ACCESS_CODE) {
  auth = new NoAuth()
} else {
  auth = new AccessCodeAuth()
}

async function init() {
  await app.prepare()

  const server = express()
  
  auth.addMiddleware(server)

  server.get('/', (req, res) => {
    if (auth.loggedIn(req)) {
      return app.render(req, res, '/')
    } else {
      return app.render(req, res, '/login')
    }
  })

  server.get('/requests/:id', auth.ensureLoggedIn, (req, res) => {
    return app.render(req, res, '/', { id: req.params.id })
  })

  server.get('/_next/*', (req, res) => {
    return handle(req, res)
  })

  server.use('/graphql', auth.ensureLoggedIn, graphqlMiddleware)

  server.get('*', auth.ensureLoggedIn, (req, res) => {
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
