const cookieSession = require('cookie-session')

class AccessCodeAuth {
  constructor() {
    this.accessCode = process.env.ACCESS_CODE
    this.sessionKey = process.env.SESSION_KEY
    if (! (this.accessCode && this.accessCode.length >= 32 &&
           this.sessionKey && this.sessionKey.length >= 64)) {
      console.error('Error: ACCESS_CODE and SESSION_KEY env vars must be set')
      process.exit(1)
    }
    this.loggedIn = this.loggedIn.bind(this)
    this.ensureLoggedIn = this.ensureLoggedIn.bind(this)
  }

  addMiddleware(server) {
    server.use(cookieSession({
      name: 'resources',
      keys: [this.sessionKey],
      maxAge: 7 * 24 * 60 * 60 * 1000
    }))

    server.post('/sign-in', (req, res) => {
      if (req.body.password === this.accessCode) {
        req.session.user = true
      }
      res.redirect('/')
    })
  }

  loggedIn(req) {
    return req.session.user;
  }

  ensureLoggedIn(req, res, next) {
    if (req.session.user) {
      next()
    } else {
      res.redirect('/')
    }
  }
}

module.exports = AccessCodeAuth