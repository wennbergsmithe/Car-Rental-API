const {getVehicle,getDriver,addVehicle,addDriver} = require('./executor')
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
    .get(getVehicle)
app
    .route('/drivers/:id')
    .get(getDriver)

//POST routes
app
    .route('/vehicles')
    .post(addVehicle)
app
    .route('/drivers')
    .post(addDriver)
    
app.listen(3002, () => {
    console.log(`Server listening`)
})