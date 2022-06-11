# Setup Environment (mac)

##(if postgres NOT already set up start here)
- brew install postgresql
- brew services start postgresql
- psql postgres
##(if postgres IS already set up start here)
- postgres=>CREATE ROLE sc_user WITH LOGIN PASSWORD 'password';
- ALTER ROLE sc_user CREATEDB;

- psql -d sc_api -U sc_user -f init.sql

- npm i cors dotenv express pg mocha chai chai-http
- npm i -D nodemon

- npm start
