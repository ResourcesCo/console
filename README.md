[![Build Status](https://travis-ci.org/benatkin/resources.svg?branch=master)](https://travis-ci.org/benatkin/resources)

# resources

Running in development:

``` bash
npm run dev
```

Running a server:

``` bash
export ACCESS_CODE=$(node -e "console.log(require('crypto').randomBytes(16).toString('hex'))")
export SESSION_KEY=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
now secrets add resources-access-code $ACCESS_CODE
now secrets add resources-session-key $SESSION_KEY
```