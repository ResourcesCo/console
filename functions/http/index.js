const axios = require('axios')

module.exports = async function request({method, url, headers, data}) {
  try {
    let response
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      response = await axios.request({method, url, headers: headers || {}})
    } else {
      response = await axios.request({method, url, headers, data})
    }
    const { status } = response
    return { status, headers: response.headers, data: response.data }
  } catch (err) {
    return { error: err.toString() }
  }
}