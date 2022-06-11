# Setup Environment (mac)
- brew install postgresql
- brew services start postgresql
- psql postgres
    - postgres=>CREATE ROLE sc_user WITH LOGIN PASSWORD 'password';
    - ALTER ROLE sc_user CREATEDB;

- psql -f /init.sql

- npm i cors dotenv express pg mocha chai chai-http
- npm i -D nodemon

- npm start
