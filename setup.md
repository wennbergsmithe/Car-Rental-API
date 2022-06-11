# Setup Environment (mac)
brew install postgresql
brew services start postgresql
psql postgres
postgres=>CREATE ROLE api_user WITH LOGIN PASSWORD 'password';
ALTER ROLE api_user CREATEDB;

psql -f /init.sql

npm i cors dotenv express pg mocha chai chai-http
npm i -D nodemon

npm start