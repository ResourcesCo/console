const {spawn, execSync} = require('child_process')

export async function pretest(task) {
  spawn('chromedriver', { stdio: 'inherit' })
  // This prevents the process from waiting indefinitely.
  setTimeout(() => process.exit(0), 2000)
}

export async function posttest(task) {
  try {
    execSync('pkill chromedriver', { stdio: 'ignore' })
  } catch (err) {
    // Do nothing
  }
}
