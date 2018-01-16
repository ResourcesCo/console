class AccessCodeAuth {
  constructor() {
    const accessCode = process.env.ACCESS_CODE
    const sessionKey = process.env.SESSION_KEY
    if (! (accessCode && accessCode.length >= 32 &&
          sessionKey && sessionKey.length >= 64)) {
      console.error('Error: ACCESS_CODE and SESSION_KEY env vars must be set')
      process.exit(1)
    }
    this.ensureLoggedIn.bind(this)
  }

  addMiddleware(server) {
    server.use(cookieSession({
      name: 'resources',
      keys: [sessionKey],
      maxAge: 7 * 24 * 60 * 60 * 1000
    }))
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