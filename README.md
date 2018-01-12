[![Build Status](https://travis-ci.org/resources/resources.svg?branch=master)](https://travis-ci.org/resources/resources)

# resources

TODO: add instructions for deploying to now

Running in development:

``` bash
export ACCESS_CODE=$(node -e "console.log(require('crypto').randomBytes(16).toString('hex'))")
export SESSION_KEY=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
npm run dev
```
