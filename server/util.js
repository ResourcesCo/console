exports.checkEnv = (varName, minLength) => {
  if (! (process.env[varName] &&
      process.env[varName].length >= minLength)) {
    throw new Error(`Missing or invalid environment variable: ${varName}`)
  }
}