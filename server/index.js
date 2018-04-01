if (! ['staging', 'production'].includes(process.env.NODE_ENV)) {
  require('now-env')
}

const express = require('express')
const next = require('next')
const cookieSession = require('cookie-session')

const port = parseInt(process.env.PORT, 10) || 4567
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, quiet: true })

const graphqlMiddleware = require('./graphql')
const auth = require('./auth')
const {checkEnv} = require('./util')

const handle = app.getRequestHandler()

async function init() {
  await app.prepare()

  const server = express()

  checkEnv('SESSION_KEY', 64)
  server.use(cookieSession({
    name: 'resources-console',
    keys: [process.env.SESSION_KEY],
    maxAge: 14 * 24 * 60 * 60 * 1000
  }))

  server.get('/auth/github', (req, res) => {
    const state = auth.randomState()
    req.session.state = state
    res.redirect(auth.authUrl(state))
  })

  server.get('/auth/github/callback', async (req, res) => {
    const {code, state} = req.query
    if (state !== req.session.state) {
      console.error('Invalid state:', state, 'Expected:', req.session.state)
      return res.status(401).json({error: 'Authentication failed.'})
    }
    delete req.session['state']

    let token
    try {
      token = await auth.getToken(code)
    } catch (e) {
      console.error('Error getting token:', e)
      return res.status(401).json({error: 'Authentication failed.'})
    }

    let user
    try {
      user = await auth.getUser(token)
    } catch (e) {
      console.error('Error getting user profile:', e)
      return res.status(401).json({error: 'Authentication failed.'})
    }

    req.session.user = user
    req.session.accessToken = await auth.seal(token)

    res.redirect('/')
  })

  server.get('/log-token', async (req, res) => {
    const token = await auth.unseal(req.session.accessToken)
    res.status(200).json({})
  })

  server.get('/', async (req, res) => {
    let loggedIn = false
    try {
      loggedIn = await auth.checkAuth(req.session.accessToken)
    } catch (e) {
      loggedIn = false
      console.log('Error checking login:', e)
    }

    if (!loggedIn) {
      app.render(req, res, '/login')
      return
    }

    app.render(req, res, '/', {id: 'none'})
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
