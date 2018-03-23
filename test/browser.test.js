const {join} = require('path')
const {spawn, execSync} = require('child_process')
const fkill = require('fkill')
const wd = require('wd')

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000

function waitFor(timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timeout)
  })
}

const nextBin = join(__dirname, '..', 'node_modules', '.bin', 'next')
const cwd = join(__dirname, '..')
const env = {
  ...process.env,
  NODE_ENV: 'production',
  CONSOLE_CONFIG_S3_BUCKET: 'resourcesco-console-config',
  CONSOLE_DATA_S3_BUCKET: 'resourcesco-console-data'
}

async function startApp() {
  const server = spawn(
    'node server',
    { stdio: 'inherit', shell: true, cwd, env }
  )
  await waitFor(500)
  return server.pid
}

describe('Home', () => {
  let chromedriver, serverPid, browser
  beforeAll(async () => {
    chromedriver = spawn('chromedriver', { stdio: 'inherit' })
    serverPid = await startApp()
    browser = wd.promiseRemote('http://localhost:9515/')
    await browser.init({browserName: 'chrome'})
  })
  afterAll(async () => {
    await browser.quit()
    try {
      fkill(serverPid).then(() => null).catch(err => null)
      fkill(chromedriver.pid).then(() => null).catch(err => null)
      execSync('killall chromedriver', { stdio: 'ignore' })
    } catch (err) {
      // ignore
    }
  })

  it('opens the site', async () => {
    await waitFor(200)
    await browser.get('http://localhost:4567/')
    await waitFor(800)

    const h1 = await browser.elementByCss('.section-bar')
    const headerText = await h1.text()
    expect(headerText).toMatch(/output/i)
  })
})
