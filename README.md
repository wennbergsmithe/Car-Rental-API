# smartcar-coding-challenge
# Setup Environment (mac)

### (if postgres NOT already set up start here)
- `brew install postgresql`
- `brew services start postgresql`

### (if postgres IS already set up start here)
- `psql postgres`
- postgres=>`CREATE ROLE sc_user WITH LOGIN PASSWORD 'password';`
- postgres=>`ALTER ROLE sc_user CREATEDB;`
- initialize database relations: `psql -d sc_api -U sc_user -f init.sql`
- install dependenceis `npm i cors dotenv express pg mocha chai chai-http`
- `npm i -D nodemon`

### start server
- `npm start`

### run tests
- `npm run unit-test`
- `npm run int-test`


# Things I would add if i had more time:
- endpoint input validation with Joi to ensure there is no broken data coming in
- more integration tests that cover all the routes and assert on more than just the status codes
- more unit tests
