const { get } = require('express/lib/response')
const { pool } = require('./config')
const {getVehicle,getDriver,addVehicle,addDriver,createTrip, getTrip,getManyTrips,updateTrip} = require('./lib')



async function getVehicleCommand(request, response) {
    console.log(request.params)
    const id = request.params.id
    try {
        const results = await getVehicle(id)
        return response.status(200).json(results)
    } catch (err) {
        return response.status(err.code).json({ status: err.code, message: err.message })
    }
}
async function getDriverCommand(request, response) {
    console.log(request.params)
    const id = request.params.id
    try {
        const results = await getDriver(id)
        return response.status(200).json(results)
    } catch (err) {
        return response.status(err.code).json({ status: err.code, message: err.message })
    }
}

async function getTripCommand(request, response) {
    console.log(request.params)
    const id = request.params.id
    try {
        const results = await getTrip(id)
        return response.status(200).json(results)
    } catch (err) {
        if (err.code === '22P02') {
            return response.status(403).json({ status: 403, message: `invalid status parameter` })
        }
        return response.status(err.code).json({ status: err.code, message: err.message })
    }
}

async function getManyTripsCommand(request, response) {
    console.log(request.query)
    const status = request.query.status

    try {
        const trips = await getManyTrips(status)
        return response.status(201).json(trips)
    } catch (err) {
        return response.status(err.code).json({ status: err.code, message: err.message })
    }

}

async function addVehicleCommand(request, response) {
    console.log(request.body)
    const { make, model, year, mileage, vin, in_use } = request.body
    try {
        const results = await addVehicle(make, model, year, mileage, vin, in_use)
        return response.status(201).json(results)
    } catch (err) {
        return response.status(err.code).json({ status: err.code, message: err.message })
    }

}

async function addDriverCommand(request, response) {
    console.log(request.body)
    const { name, licenseNumber, phoneNumber } = request.body
    try {
        const results = await addDriver(name, licenseNumber, phoneNumber)
        return response.status(201).json(results)
    } catch (err) {
        return response.status(err.code).json({ status: err.code, message: err.message })
    }
}

async function createTripCommand(request, response) {
    console.log(request.body)
    const { vehicleId, driverId, startedAt, expectedReturn } = request.body
    //validate
    try {
        const results = await createTrip( vehicleId, driverId, startedAt, expectedReturn )
        response.status(200).json(results)
        
    } catch (err) {
        return response.status(err.code).json({ status: err.code, message: err.message })
    }
}


async function updateTripCommand(request, response) {
    console.log(request.body)
    const { tripId, status, expectedReturn } = request.body

    try {
        const results = await updateTrip(tripId, status, expectedReturn)
        return response.status(200).json(results)
    } catch (err) {
        return response.status(err.code).json({ status: err.code, message: err.message })
    }
}

module.exports = { getDriverCommand, getVehicleCommand, addDriverCommand, addVehicleCommand, createTripCommand, getTripCommand, getManyTripsCommand, updateTripCommand };