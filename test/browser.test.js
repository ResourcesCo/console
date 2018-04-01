require('now-env')
const {join} = require('path')
const {spawn, execSync} = require('child_process')
const fkill = require('fkill')
const wd = require('wd')

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000

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
  AWS_S3_BUCKET: 'resourcesco-console-data'
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

  it('is authorized', async () => {
    await waitFor(200)
    await browser.get('http://localhost:4567/')
    await waitFor(800)

    const button = await browser.elementByCss('button.sign-in')
    const buttonText = await button.text()
    expect(buttonText).toMatch(/sign in with github/i)
    await button.click()
    await waitFor(500)

    const usernameInput = await browser.elementByCss('[name=login]')
    await browser.type(usernameInput, process.env.TEST1_GITHUB_USERNAME)
    const passwordInput = await browser.elementByCss('[name=password]')
    await browser.type(passwordInput, process.env.TEST1_GITHUB_PASSWORD)
    const submitButton = await browser.elementByCss('[type=submit]')
    await submitButton.click()
    await waitFor(500)

    const h1 = await browser.elementByCss('.section-bar')
    const headerText = await h1.text()
    expect(headerText).toMatch(/output/i)
  })

  it('is not authorized', async () => {
    await waitFor(200)
    await browser.get('http://localhost:4567/')
    await waitFor(800)

    const button = await browser.elementByCss('button.sign-in')
    const buttonText = await button.text()
    expect(buttonText).toMatch(/sign in with github/i)
    await button.click()
    await waitFor(500)

    const usernameInput = await browser.elementByCss('[name=login]')
    await browser.type(usernameInput, process.env.TEST2_GITHUB_USERNAME)
    const passwordInput = await browser.elementByCss('[name=password]')
    await browser.type(passwordInput, process.env.TEST2_GITHUB_PASSWORD)
    const submitButton = await browser.elementByCss('[type=submit]')
    await submitButton.click()
    await waitFor(500)

    const button2 = await browser.elementByCss('button.sign-in')
    const buttonText2 = await button2.text()
    expect(buttonText2).toMatch(/sign in with github/i)
  })
})
