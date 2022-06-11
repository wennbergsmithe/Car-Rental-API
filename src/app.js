const {getVehicleCommand,getDriverCommand,addVehicleCommand,addDriverCommand,createTripCommand, getTripCommand,getManyTripsCommand,updateTripCommand }= require('./commands')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

//GET routes
app
    .route('/vehicles/:id')
    .get(getVehicleCommand)
app
    .route('/drivers/:id')
    .get(getDriverCommand)

app
    .route('/trips/:id')
    .get(getTripCommand)
app
    .route('/trips/:status?')
    .get(getManyTripsCommand)

//POST routes
app
    .route('/vehicles')
    .post(addVehicleCommand)
app
    .route('/drivers')
    .post(addDriverCommand)

app
    .route('/trips')
    .post(createTripCommand)

//PUT routes
app
    .route('/trips')
    .put(updateTripCommand)

app.listen(3002, () => {
    console.log(`Server listening`)
})