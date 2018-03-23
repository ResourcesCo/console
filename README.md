[![Build Status](https://travis-ci.org/resources/console.svg?branch=master)](https://travis-ci.org/resources/console) [![with-coffee](https://img.shields.io/badge/made%20with-%E2%98%95%EF%B8%8Fcoffee-yellow.svg)](https://github.com/morajabi/with-coffee)

# resources

## S3

Create a two s3 buckets, one for data and one for configuration.
Suggested names: `projectname-console-data` and `projectname-console-config`.
Create an IAM username that has access to these buckets. Enter the
information into these environment variables:

- `CONSOLE_AWS_ACCESS_KEY_ID`
- `CONSOLE_AWS_SECRET_ACCESS_KEY`
- `CONSOLE_AWS_DEFAULT_REGION` - Optional. This may make access faster.
- `CONSOLE_AWS_ENDPOINT` - Optional. This enables DigitalOcean Spaces and Minio.
- `CONSOLE_CONFIG_S3_BUCKET`
- `CONSOLE_DATA_S3_BUCKET`

## GitHub OAuth

Register a new GitHub OAuth application, set the redirect to `/auth/github`
on your server or `localhost:4567/auth/github`, and fill this out:

- `CONSOLE_BASE_URL` - The base URL, including `https:` but not including
    the trailing backslash. Example: `https://console.example.com`
- `CONSOLE_GITHUB_CLIENT_ID` - The client ID from registering the OAuth application
- `CONSOLE_GITHUB_CLIENT_SECRET` - The client secret from registering the OAuth application
- `CONSOLE_GITHUB_USERS` - Separated by commas. Each can either be just a username,
    or `username:id`. Examples: `example,myexample`, `example:123,example2:456`,
    `examplewithid:123, plainexample`
- `CONSOLE_GITHUB_TEAMS` - The organization and the slug with a slash
    between them. Example: `resources/dev`. Like CONSOLE_GITHUB_USERS it
    can also contain an ID. Examples: `resources/dev,resources/contractors`,
    `resources/dev:518,resources/contractors:319`

In the future IDs may be stored in the configuration database and be required
to match, and/or the app might provide help in modifying the environment variables
to include IDs for more security. GitHub allows username reuse but in order for
a username to be reused it must first be deleted. If this is not a concern, IDs
don't need to be added. They are still recommended, though.

- [Find a GitHub user ID](https://caius.github.io/github_id/)
- [Find a GitHub team ID](http://fabian-kostadinov.github.io/2015/01/16/how-to-find-a-github-team-id/)

## Session Key

- `CONSOLE_SESSION_KEY` - You can generate this using:
    
    ```
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    ```