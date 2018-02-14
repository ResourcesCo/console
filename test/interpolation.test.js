const {interpolate} = require('../lib/interpolation')

describe('interpolation', () => {
  it('adds secrets from environment variables', () => {
    process.env.foo = 'BAR'
    expect(interpolate({nest: {hello: '${secrets.foo}'}})).toEqual({nest: {hello: 'BAR'}})
  })
})