const crypto = require('crypto')
const simpleAuth = require('simple-oauth2')
const Iron = require('iron')
const ApiFunction = require('./api-function')
const http = ApiFunction.findById('http').fn
const lruCache = require('lru-cache')

const authCache = lruCache({max: 50, maxAge: 30 * 60 * 1000})

const oauth = simpleAuth.create({
  client: {
    id: process.env.GITHUB_CLIENT_ID,
    secret: process.env.GITHUB_CLIENT_SECRET
  },
  auth: {
    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token',
    authorizePath: '/login/oauth/authorize'
  }
})

const allowedUsers = process.env.GITHUB_USERS.split(',').map(s => {
  const a = s.trim().split(':')
  return {
    id: parseInt(a[1].trim(), 10),
    username: a[0].trim()
  }
})

exports.randomState = () => {
  return crypto.randomBytes(16).toString('hex')
}

exports.authUrl = state => {
  return oauth.authorizationCode.authorizeURL({
    redirect_uri: `${process.env.BASE_URL}/auth/github/callback`,
    scope: '',
    state
  })
}

exports.getToken = async (code) => {
  const result = await oauth.authorizationCode.getToken({code})
  if (!result.access_token) {
    console.error('Token request failed', result)
    throw new Error('Token request failed')
  }
  return result.access_token
}

exports.getUser = async (token) => {
  const request = {
    "method": "GET",
    "url": "https://api.github.com/user",
    "headers": {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
      "User-Agent": "resourcesco-console"
    }
  }
  const response = await http(request)
  if (response.status !== 200) {
    console.error('Username request failed', response)
    throw new Error('Username request failed')
  }
  return {
    id: response.data.id,
    username: response.data.login
  }
}

exports.checkAuth = async (encryptedToken = null) => {
  if (!encryptedToken) {
    return false
  }

  const cachedResult = authCache.get(encryptedToken)
  if (cachedResult === true || cachedResult === false) {
    return cachedResult
  }

  const token = await exports.unseal(encryptedToken)
  const user = await exports.getUser(token)
  const matchedUsers = allowedUsers.filter(iterUser => {
    return iterUser.id === user.id && iterUser.username === user.username
  })
  const result = matchedUsers.length > 0
  authCache.set(encryptedToken, result)
  return result
}

exports.seal = async value => {
  return await Iron.seal(value, process.env.SESSION_KEY + '_encrypt', Iron.defaults)
}

exports.unseal = async value => {
  return await Iron.unseal(value, process.env.SESSION_KEY + '_encrypt', Iron.defaults)
}