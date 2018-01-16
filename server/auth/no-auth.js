class NoAuth {
  constructor() {
    this.ensureLoggedIn.bind(this)
  }

  addMiddleware(server) {
    // none to add
  }

  loggedIn(req) {
    return true
  }

  ensureLoggedIn(req, res, next) {
    next()
  }
}

module.exports = NoAuth