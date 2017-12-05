const {join} = require('path')
const {spawn} = require('child_process')
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

async function startApp() {
  const instance = spawn(
    '/usr/bin/env',
    ['NODE_ENV=production', 'node', 'server.js'],
    { stdio: 'inherit', cwd }
  )
  await waitFor(500)
  return instance.pid
}

describe('Home', () => {
  let pid
  beforeAll(async () => {
    pid = await startApp()
  })
  afterAll(async () => {
    fkill(pid)
  })

  it('loads home page', async () => {
    const browser = wd.promiseRemote('http://localhost:9515/')
    await browser.init({browserName: 'chrome'})
    await browser.get('http://localhost:3000/')
    await waitFor(200)
    const submit = await browser.elementByCss('input[type=submit]')
    const submitValue = await submit.getAttribute('value')
    expect(submitValue).toBe('ENTER')
  })
})
