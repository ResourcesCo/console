[![Build Status](https://travis-ci.org/resources/console.svg?branch=master)](https://travis-ci.org/resources/console)

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

## Security Model

- *Secrets can be accessed when making requests.* No user should be allowed
  to make a request that shouldn't be allowed to access the secret. The
  secrets aren't logged, but any user that can make a request that uses a
  secret can get that secret, by using it in httpbin where the request body
  is sent back to the client, or in creating a resource that they can access.

  Allowing users to make a request without being able to access a secret
  would open up more uses cases.