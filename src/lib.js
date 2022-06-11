const res = require('express/lib/response');
const { keepalives } = require('pg/lib/defaults')
const { pool } = require('./config')
class BadRequestError extends Error {
    constructor(message, code = 400) {
        super(message);
        this.code = code;
    }
}

async function getVehicle(request, response) {
    console.log(request.params)
    const id = request.params.id
    try {
        const results = await pool.query('SELECT id,make FROM Vehicle WHERE id = $1', [id])
        if (results.rowCount === 0) {
            throw new BadRequestError(`no vehicle with id ${id}`, 404)
        }
        return response.status(200).json(results.rows[0])
    } catch (err) {
        return response.status(err.code).json({ status: err.code, message: err.message })
    }
}
async function getDriver(request, response) {
    console.log(request.params)
    const id = request.params.id
    try {
        const results = await pool.query('SELECT id,name FROM Driver WHERE id = $1', [id])
        if (results.rowCount === 0) {
            throw new BadRequestError(`no driver with id ${id}`)
        }
        return response.status(200).json(results.rows[0])
    } catch (err) {
        return response.status(err.code).json({ status: err.code, message: err.message })
    }
}

async function getTrip(request, response) {
    console.log(request.params)
    const id = request.params.id

    try {
        const results = await pool.query(
            'SELECT t.*, d.name, v.make , v.model FROM Trip t JOIN Vehicle v ON t.vehicle = v.id JOIN Driver d ON t.driver = d.id WHERE t.id = $1',
            [id]
        )
        if (results.rowCount === 0) {
            throw new BadRequestError(`no trip with id ${id}`,404)
        } else {
            return response.status(200).json(
                {
                    id: results.rows[0].id,
                    status: results.rows[0].status,
                    startedAt: results.rows[0].startedAt,
                    expectedReturn: results.rows[0].expectedReturn,
                    driver: {
                        driverId: results.rows[0].driver,
                        driverName: results.rows[0].name
                    },
                    vehicle: {
                        vehicleId: results.rows[0].vehicle,
                        make: results.rows[0].make,
                        model: results.rows[0].model
                    }
                }
            )
        }
    } catch (err) {
        return response.status(err.code).json({ status: err.code, message: err.message })
    }
}

async function getManyTrips(request,response) {
    console.log(request.params)
    const status = request.params.status

    try{
        const results = await pool.query(
            'SELECT t.*, d.name, v.make , v.model FROM Trip t JOIN Vehicle v ON t.vehicle = v.id JOIN Driver d ON t.driver = d.id WHERE t.status = $1',
            [status]
        )
        if(results.rowCount === 0){
            throw new BadRequestError(`there are no trips!`,404)
        }else{
            let trips = []
            results.rows.forEach(trip => {
                trips.push(
                    {
                        id: trip.id,
                        status: trip.status,
                        startedAt: trip.startedAt,
                        expectedReturn: trip.expectedReturn,
                        driver: {
                            driverId: trip.driver,
                            driverName: trip.name
                        },
                        vehicle: {
                            vehicleId: trip.vehicle,
                            make: trip.make,
                            model: trip.model
                        }
                    }
                )
            })            
        }
    }catch(err){
        return response.status(err.code).json({ status: err.code, message: err.message })
    }

}

async function addVehicle(request, response) {
    console.log(request.body)
    const { make, model, year, mileage, vin, in_use } = request.body
    try {
        const results = await pool.query(
            'INSERT INTO Vehicle (make, model, year, mileage, vin, in_use) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
            [make, model, year, mileage, vin, in_use]
        )
    } catch (err) {
        return response.status(err.code).json({ status: err.code, message: err.message })
    }

}
async function addDriver(request, response) {
    console.log(request.body)
    const { name, licenseNumber, phoneNumber } = request.body

    try {
        const results = await pool.query(
            'INSERT INTO Driver (name, license_number, phone_number) VALUES ($1,$2,$3) RETURNING id',
            [name, licenseNumber, phoneNumber])
        return response.status(201).json({ id: results.rows[0].id, name })
    } catch (err) {
        return response.status(err.code).json({ status: err.code, message: err.message })
    }
}

async function createTrip(request, response) {
    console.log(request.body)
    const { vehicleId, driverId, startedAt, expectedReturn } = request.body
    let driver, vehicle
    //validate

    try {
        const results = await pool.query('SELECT * FROM Vehicle WHERE id = $1', [vehicleId]);
        if (results.rowCount === 0) {
            throw new BadRequestError(`vehicle ${vehicleId} does not exist.`)
        } else if (results.rows[0].in_use) {
            throw new BadRequestError(`vehicle ${vehicleId} is not available for rental`)
        } else {
            vehicle = results.rows[0]
        }
    } catch (err) {
        return response.status(err.code).json({ status: err.code, message: err.message })
    }

    try {
        const results = await pool.query('SELECT * FROM Driver WHERE id = $1', [driverId])
        if (results.rowCount === 0) {
            throw new BadRequestError(`driver ${driverId} does not exist`)
        } else {
            driver = results.rows[0]
        }
    } catch (err) {
        return response.status(err.code).json({ status: err.code, message: err.message })
    }

    //execute
    try {
        const results = await pool.query('INSERT INTO Trip (status,started_at, expected_return, driver, vehicle) VALUES ($1,$2,$3,$4,$5) RETURNING *', ['active', startedAt, expectedReturn, driverId, vehicleId])
        if (results.rowCount === 0) {
            throw new BadRequestError(`driver ${driverId} does not exist`)
        } else {
            await pool.query('UPDATE Vehicle SET in_use = TRUE WHERE id = $1', [vehicleId])
            response.status(200).json({ id: results.rows[0].id, status: results.rows[0].status, startedAt, expectedReturn, driver, vehicle })
        }
    } catch (err) {
        return response.status(err.code).json({ status: err.code, message: err.message })
    }
}

module.exports = { getDriver, getVehicle, addDriver, addVehicle, createTrip, getTrip, getManyTrips};