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
  SESSION_KEY: '8c415823f70769700a1440dc3b871ecb7666e481332a874a22ad2595f954fef13c37ffd1cd9eb6c49d99258fe9e3f8ad841350a5523c3f86c726fe2a34bb1020',
  ACCESS_CODE: '030245c3d496d0811636a7b3dfeebc5b33c9804eb1053feb3460744ae7b8f5435d629bd0ce552ea1846a3f95e39f1b6fdea5293809c71f3779313c3ee3f60d75'
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
      fkill(serverPid)
      fkill(chromedriver.pid)
      execSync('killall chromedriver', { stdio: 'ignore' })
    } catch (err) {
      // ignore
    }
  })

  it('logs in', async () => {
    await browser.get('http://localhost:3000/')
    await waitFor(200)

    const input = await browser.elementByCss('input[name=password]')
    await input.sendKeys(env.ACCESS_CODE)

    const submit = await browser.elementByCss('input[type=submit]')
    const submitValue = await submit.getAttribute('value')
    expect(submitValue).toBe('ENTER')
    await submit.click()

    await waitFor(200)
    const h1 = await browser.elementByCss('.section-bar')
    const headerText = await h1.text()
    expect(headerText).toMatch(/output/i)
  })
})
