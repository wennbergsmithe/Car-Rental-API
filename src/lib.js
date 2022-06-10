const { keepalives } = require('pg/lib/defaults')
const { pool } = require('./config')


const getVehicle = (request, response) => {
    const id = request.params.id
    pool.query('SELECT id,make FROM Vehicle WHERE id = $1',
        [id],
        (error, results) => {
            if (error) {
                throw `ERROR::getVehicle threw an error: ${error}`
            } else {
                if (results.rowCount === 0) {
                    response.status(404).json({ status: 404, message: `no vehicle with id ${id}` })
                }
            }
            response.status(200).json(results.rows[0])
        })
}
const getDriver = (request, response) => {
    const id = request.params.id
    pool.query('SELECT id,name FROM Driver WHERE id = $1',
        [id],
        (error, results) => {
            if (error) {
                throw `ERROR::getDriver threw an error: ${error}`
            } else {
                if (results.rowCount === 0) {
                    response.status(404).json({ status: 404, message: `no driver with id ${id}` })
                }
            }
            response.status(200).json(results.rows[0])
        })
}
const addVehicle = (request, response) => {
    const { make, model, year, mileage, vin, in_use } = request.body

    pool.query(
        'INSERT INTO Vehicle (make, model, year, mileage, vin, in_use) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
        [make, model, year, mileage, vin, in_use],
        (error, results) => {
            if (error) {
                // response.status(500).json({status:500,error})
                throw `ERROR::addVehicle threw and error: ${error}`
            }
            response.status(201).json({ message: "success", vehicle: { id: results.rows[0].id, make, model, year, mileage, vin, in_use } })
        }

    )
}
const addDriver = (request, response) => {
    const { name, licenseNumber, phoneNumber } = request.body

    pool.query(
        'INSERT INTO Driver (name, license_number, phone_number) VALUES ($1,$2,$3) RETURNING id',
        [name, licenseNumber, phoneNumber],
        (error, results) => {
            if (error) {
                throw `ERROR::addDriver threw and error: ${error}`
            }
            response.status(201).json({ id: results.rows[0].id, name })
        }

    )
}

const createTrip = (request, response) => {
    const { vehicleId, driverId, startedAt, expectedReturn } = request.body
    let driver, vehicle
    //validation
    pool.query(
        'SELECT * FROM Vehicle WHERE id = $1',
        [vehicleId],
        (error, results) => {
            if (error) {
                throw `ERROR::createTrip threw an error: ${error}`
            } else if (results.rowCount === 0) {
                response.status(404).json({ status: 404, message: `vehicle with id ${vehicleId} does not exist.` })
            } else if (results.rows[0].in_use) {
                response.status(403).json({ status: 403, message: `vehicle with id ${vehicleId} is not available for rental` })
            } else {
                vehicle = results.rows[0]
            }
        }
    )
    pool.query(
        'SELECT * FROM Driver WHERE id = $1',
        [driverId],
        (error, results) => {
            if (error) {
                throw `ERROR::createTrip threw an error: ${error}`
            } else if (results.rowCount === 0) {
                response.status(404).json({ status: 404, message: `driver with id ${driverId} does not exist` })
            } else {
                driver = results.rows[0]
            }
        }
    )

    //event
    pool.query(
        'INSERT INTO Trip (status,started_at, expected_return, driver, vehicle) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        ['active', startedAt, expectedReturn, driverId, vehicleId],
        (error, results) => {
            if (error) {
                throw `ERROR::createTrip threw an error: ${error}`
            } else {
                response.status(200).json({ id: results.rows[0].id, status: results.rows[0].status, startedAt, expectedReturn, driver, vehicle })
            }
        }
    )
    pool.query(
        'UPDATE Vehicle SET in_use = TRUE WHERE id = $1',
        [vehicleId],
        (error) =>{
            if(error){
                throw `ERROR::createTrip threw an error: ${error}`
            }
        }
    )
}

module.exports = { getDriver, getVehicle, addDriver, addVehicle, createTrip};