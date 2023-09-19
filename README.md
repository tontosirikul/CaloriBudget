
# CaloriBudget

This repository contains a frontend and backend code to develop CaloriBudget, an App for Nutrition and Expenses Tracking.












## DB Setup

Get Postgresql here: [Postgresql official's site](https://www.postgresql.org/download/)

- Create username for database`<username>`

```
CREATE USER <username> WITH PASSWORD '<password>';

```

- Create database for development `<name_dev_db>`

```
CREATE DATABASE <name_dev_db>;
```

- Create database for testing `<name_test_db>`

```
CREATE DATABASE <name_test_db>;
```
## Environment SETUP

create files called `.env.development` and `.env.test` at root of backend directory and put environment setup as below to those files.  To get start make sure you have `yarn`, `expo` `postgresql`, `dotenv-cli` installed on machine.

```
DATABASE_URL=<"postgresql://server:password@localhost:5432/database_name_dev_or_test?schema=public">
ENV=<dev or test>
saltRounds=<any number>
bcrypt_code=<any string>
TOKEN_SECRET = <any string>
```




## Installation and Running Backend

change directory to backend

```bash
cd backend
```
install backend dependencies
```bash
yarn install
```
migrate development database
```bash
yarn migrate
```
start backend server
```bash
yarn start
```

## Installation and Running Frontend

* Make sure `apiConfig.ts` uses the correct backend url. 

change directory to backend

```bash
cd frontend
```
install frontend dependencies
```bash
yarn install
```
start frontend server
```bash
yarn start
```

## Others Backend Commands

Reset development database
```
yarn reset
```
Open database ui
```
yarn opendb
```

Run unit test
```
yarn reset-test && yarn test --runInBand
```
## Demo

https://youtu.be/M1yU_WnxAek


## Authors

- Tanhapon Tosirikul

