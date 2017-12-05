const express = require('express')
const next = require('next')

const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const accessCode = process.env.ACCESS_CODE
const sessionKey = process.env.SESSION_KEY
if (! (accessCode.length >= 64 && sessionKey.length >= 64)) {
  // TODO: show these instructions on the page
  console.error('Error: ACCESS_CODE and SESSION_KEY env vars must be set')
  process.exit(1)
}

function ensureLoggedIn(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/')
  }
}

async function init() {
  await app.prepare()

  const server = express()

  server.use(bodyParser.urlencoded({ extended: false }))

  server.use(cookieSession({
    name: 'resources',
    keys: [sessionKey],
    maxAge: 7 * 24 * 60 * 60 * 1000
  }))

  server.post('/sign-in', (req, res) => {
    if (req.body.password === accessCode) {
      req.session.user = true
    }
    res.redirect('/')
  })

  server.get('/', (req, res) => {
    if (req.session.user) {
      return app.render(req, res, '/')
    } else {
      return app.render(req, res, '/login')
    }
  })

  server.get('*', ensureLoggedIn, (req, res) => {
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
