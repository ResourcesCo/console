const crypto = require('crypto')
const simpleAuth = require('simple-oauth2')
const Iron = require('iron')
const ApiFunction = require('./api-function')
const http = ApiFunction.findById('http').fn
const lruCache = require('lru-cache')

const teamCache = lruCache({max: 10, maxAge: 30 * 60 * 1000})
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

exports.randomState = () => {
  return crypto.randomBytes(16).toString('hex')
}

exports.authUrl = state => {
  return oauth.authorizationCode.authorizeURL({
    redirect_uri: `${process.env.BASE_URL}/auth/github/callback`,
    scope: 'read:org',
    state
  })
}

exports.getToken = async ({code}) => {
  const result = await oauth.authorizationCode.getToken({code})
  return result.access_token
}

exports.getUsername = async ({token}) => {
  const request = {
    "method": "GET",
    "url": "https://api.github.com/user",
    "headers": {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
      "User-Agent": "resources"
    }
  }
  const response = await http(request)
  if (response.status !== 200) {
    console.error('Username request failed', response)
    throw new Error('Username request failed')
  }
  return response.data.login
}

exports.checkAuth = async ({encryptedToken}) => {
  
}

exports.seal = async value => {
  return await Iron.seal(value, process.env.SESSION_KEY, Iron.defaults)
}

exports.unseal = async value => {
  return await Iron.unseal(value, process.env.SESSION_KEY, Iron.defaults)
}