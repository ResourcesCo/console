function interpolateString(value) {
  let matched = false
  result = value.replace(/\${\s*(\w+)\.(\w+)\s*}/, (str, name1, name2) => {
    if (name1 === 'secrets') {
      matched = true
      return process.env[name2]
    } else {
      return str
    }
  })
  if (matched) {
    return result
  }
}

function interpolateObject(value) {
  let changes
  for (let key of Object.keys(value)) {
    const interpolated = interpolate(value[key])
    if (interpolated) {
      if (changes === undefined) {
        changes = {}
      }
      changes[key] = interpolated
    }
  }
  if (changes) {
    return { ...value, ...changes }
  }
}

function interpolateArray(value) {
  let result
  for (let i=0; i < value.length; i++) {
    const interpolated = interpolate(value[i])
    if (interpolated) {
      if (result === undefined) {
        result = value.slice()
      }
      result[i] = interpolated
    }
  }
  return updated
}

function interpolate(value) {
  if (typeof value === 'string') {
    return interpolateString(value)
  } else if (Array.isArray(value)) {
    return interpolateArray(value)
  } else if (value !== null && typeof value === 'object') {
    return interpolateObject(value)
  }
}

exports.interpolate = interpolate