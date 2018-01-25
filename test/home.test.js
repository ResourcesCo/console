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
  SESSION_KEY: 'b5286b7ca136457924c4bb04bec328d2e6a74ff87cbb0d89667676c5432fed10055ac7d56195963060906977c4dddba35e3f8ac770c3ee7bac1f303ac4c450d8',
  ACCESS_CODE: '53184f758a2ef399dddbb246f4b3f7fd'
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
