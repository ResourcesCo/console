const axios = require('axios')

export default async function request({method, url, headers, data}) {
  try {
    let response
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      response = axios.request({method, url, headers: headers || {}})
    } else {
      response = axios.request({method, url, headers, data})
    }
    const { status, headers, data } = response
    return { status, headers, data }
  } catch (err) {
    return { error: err.toString() }
  }
}