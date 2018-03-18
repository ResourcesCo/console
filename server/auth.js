const crypto = require('crypto')
const simpleAuth = require('simple-oauth2')

const auth = simpleAuth.create({
  client: {
    id: process.env.CONSOLE_GITHUB_CLIENT_ID,
    secret: process.env.CONSOLE_GITHUB_CLIENT_SECRET
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
  return auth.authorizationCode.authorizeURL({
    redirect_uri: `${process.env.CONSOLE_BASE_URL}/auth/github/callback`,
    scope: '',
    state
  })
}

exports.getToken = async ({code}) => {
  const result = await auth.authorizationCode.getToken({code})
  console.log('result', result)
  return auth.accessToken.create(result)
}