[![Build Status](https://travis-ci.org/resources/console.svg?branch=master)](https://travis-ci.org/resources/console) [![with-coffee](https://img.shields.io/badge/made%20with-%E2%98%95%EF%B8%8Fcoffee-yellow.svg)](https://github.com/morajabi/with-coffee)

# resources.co API console

The resources.co API console is a web application which enables people to make
API requests and database queries and share them with others on their team.
It's very simple to set up, and only requires a node.js server (which can be
set up easily on a PaaS like [now](https://now.sh) or
[Heroku](https://heroku.com/), a GitHub account for authentication, and an S3
bucket for storage.

# Getting Started

## Step 1: Set up GitHub OAuth

You'll need a node.js server, and to know what URL it will be deployed at,
and to define some environment variables.

If you're using `now`, you can copy `now.sample.json` to `now.json` and
define them in `now.json`. You can use
[now-secrets](https://zeit.co/blog/environment-variables-secrets) or just
replace `@console-aws-secret-access-key` and
`@console-github-client-secret` with the actual values (environment
variables in now.sh are private whether or not they're secrets - secrets
just adds an extra level of protection).

First you'll need a session token. You can generate one using:

``` bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Store it in the environment variable `SESSION_KEY`.

Next you'll need to define the node environment and the base URL of
your site:

- `NODE_ENV`: set this to `staging` or `production` when deploying, or
    leave blank when running locally
- `BASE_URL`: set this to the base URL without a trailing slash - example:
    `https://example.now.sh` when deploying or `http://localhost:4567`
    when running locally

On to setting up a GitHub application. Go to [GitHub > Settings >
Developer Settings > OAuth Applications > New OAuth
App](https://github.com/settings/applications/new) and create one. Use
`$BASE_URL/auth/github` for the *Authorization callback URL*. Example:
`https://example.now.sh/auth/github` or `http://localhost:4567`

Once it's created, set these environment variables:

- `GITHUB_CLIENT_ID` - The client ID from registering the OAuth application
- `GITHUB_CLIENT_SECRET` - The client secret from registering the OAuth
    application

Now to define who is allowed to access it. This is in the `GITHUB_USERS`
environment variable, and is a comma-separated list of `name:id` pairs.
Both the username and the user ID must match. To get the user ids, run
the command below or go to [Find Github User
ID](https://caius.github.io/github_id/):

``` bash
curl https://api.github.com/users/username
```

Define `GITHUB_USERS` like this:

`benatkin:4126,resources-test:37493865`

## Step 2: Set up an S3 bucket

Create an S3 bucket, and an IAM user that has read/write access to the bucket.
Add these variables to your server's environment:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_DEFAULT_REGION` - Optional. This may make access faster.
- `AWS_ENDPOINT` - Optional. This enables DigitalOcean Spaces, Minio, and other S3-compatible services.
- `AWS_S3_BUCKET` - The name of the bucket

## Step 3: Deploy

Finally, deploy the app and open it in your browser. It will prompt you to sign
in with GitHub. When you're signed in, you can make an HTTP request.

# Development

## CI

### Setting travis-ci secrets

``` bash
travis encrypt SESSION_KEY=$SESSION_KEY --add env.global
travis encrypt GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET --add env.global
travis encrypt AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY --add env.global
travis encrypt TEST1_GITHUB_PASSWORD=$TEST1_GITHUB_PASSWORD --add env.global
travis encrypt TEST2_GITHUB_PASSWORD=$TEST2_GITHUB_PASSWORD --add env.global
```