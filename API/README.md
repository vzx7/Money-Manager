
# Accounting App REST API

Simple secure accounting API allowing users to add their income and expenses.

## Tech Stack
- NodeJS
- NestJS (With Express.js)
- PostgreSQL
- TypeORM
- Swagger


## Demo
[https://cb-accounting-app-api.herokuapp.com/](https://cb-accounting-app-api.herokuapp.com/)


## Installation

```bash
$ npm install
```

You need to add a root .env file with the following content:
```bash
DB_USERNAME = your_name
DB_PASSWORD = your_password
DB_HOST = localhost
DB_PORT = 5432
DB_DATABASE = your_db_name
DB_SSL = false

JWT_SECRET = your_secret
PORT = 4444
ADMIN_ACCESS_TOKEN = your_admin_access_token
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - [Christian Balola](https://chrisbalola.com)
- Website - [chrisbalola.com](https://www.chrisbalola.com/)
- Twitter - [@chrisbalola](https://twitter.com/chrisbalola)
- LinkedIn - [@chrisbalola](https://www.linkedin.com/in/chrisbalola/)

