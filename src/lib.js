const { query } = require('express');
const res = require('express/lib/response');
const { keepalives } = require('pg/lib/defaults')
const { pool } = require('./config')
class BadRequestError extends Error {
    constructor(message, code = 400) {
        super(message);
        this.code = code;
    }
}

/**
 * gets a vehicle by id 
 * @param {*} id 
 * @param {*} requiresInUse 
 * @returns vehicle object
 */
async function getVehicle(id,requiresInUse=false){
    const results = await pool.query('SELECT id, make, in_use FROM Vehicle WHERE id = $1', [id])
        if (results.rowCount === 0) {
            throw new BadRequestError(`no vehicle with id ${id}`, 404)
        }if(requiresInUse && results.rows[0].in_use){
            throw new BadRequestError(`vehicle ${id} is not available for rental`)
        }
        return results.rows[0]
}

/**
 * gets a driver by id
 * @param {*} id 
 * @returns driver object
 */
async function getDriver(id) {
    const results = await pool.query('SELECT id,name FROM Driver WHERE id = $1', [id])
    if (results.rowCount === 0) {
        throw new BadRequestError(`no driver with id ${id}`)
    }
    return results.rows[0]
}

/**
 * gets a trip by id
 * @param {*} id 
 * @returns trip object
 */
async function getTrip(id) {
    const results = await pool.query(`
        SELECT  t.*,
                d.name,
                v.make,
                v.model 
           FROM Trip t 
           JOIN Vehicle v ON t.vehicle = v.id
           JOIN Driver d ON t.driver = d.id
          WHERE t.id = $1`,
        [id]
    )
    if (results.rowCount === 0) {
        throw new BadRequestError(`no trip with id ${id}`, 404)
    } else {
        return {
            id: results.rows[0].id,
            status: results.rows[0].status,
            startedAt: results.rows[0].started_at,
            expectedReturn: results.rows[0].expected_return,
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
    }
}

/**
 * gets all trips with given status
 * @param {*} status 'active'|'inactive'
 * @returns array of trip objects
 */
async function getManyTrips(status) {
    if (status != 'active' && status != 'inactive') {
        throw new BadRequestError(`status must be active or inactive`)
    }
    const results = await pool.query(`
        SELECT t.*,
               d.name,
               v.make,
               v.model
          FROM Trip t
          JOIN Vehicle v ON t.vehicle = v.id
          JOIN Driver d ON t.driver = d.id
         WHERE t.status = $1`,
        [status]
    )
    if (results.rowCount === 0) {
        throw new BadRequestError(`there are no ${status} trips!`, 404)
    } else {
        let trips = []
        results.rows.map((result) => {
            trips.push(
                {
                    id: result.id,
                    status: result.status,
                    startedAt: Date(result.started_at),
                    expectedReturn: Date(result.expected_return),
                    driver: {
                        driverId: result.driver,
                        driverName: result.name
                    },
                    vehicle: {
                        vehicleId: result.vehicle,
                        make: result.make,
                        model: result.model
                    }
                }
            )
        })
        return trips
    }
}

/**
 * adds a vehicle to the database
 * @param {*} make 
 * @param {*} model 
 * @param {*} year 
 * @param {*} mileage 
 * @param {*} vin 
 * @param {*} in_use 
 * @returns vehicle object
 */
async function addVehicle(make, model, year, mileage, vin, in_use) {
    const results = await pool.query(`
           INSERT INTO Vehicle (make, model, year, mileage, vin, in_use)
           VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING id`,
        [make, model, year, mileage, vin, in_use]
    )
    return {
        id: results.rows[0].id,
        make, model, year,
        mileage, vin, in_use
    }
}

/**
 * adds driver to the database 
 * @param {*} name 
 * @param {*} licenseNumber 
 * @param {*} phoneNumber 
 * @returns new driver object 
 */
async function addDriver(name, licenseNumber, phoneNumber) {
    const results = await pool.query(`
           INSERT INTO Driver (name, license_number, phone_number)
           VALUES ($1,$2,$3)
        RETURNING id`,
        [name, licenseNumber, phoneNumber]
    )
    return {
        id: results.rows[0].id,
        name
    }
}

/**
 * creates a new trip in the db and connects it to a driver and vehicle
 * @param {*} vehicleId 
 * @param {*} driverId 
 * @param {*} startedAt 
 * @param {*} expectedReturn 
 * @returns trip object 
 */
async function createTrip(vehicleId, driverId, startedAt, expectedReturn) {
    let driver, vehicle

    try{
        driver = await getDriver(driverId);
        vehicle = await getVehicle(vehicleId,true)
    }catch(e){
        throw e //pass error on to command
    }
    const results = await pool.query(`
           INSERT INTO Trip (status,started_at, expected_return, driver, vehicle)
           VALUES ($1,$2,$3,$4,$5)
        RETURNING *`,
        ['active', startedAt, expectedReturn, driverId, vehicleId])
    if (results.rowCount === 0) {
        throw new BadRequestError(`driver ${driverId} does not exist`)
    } else {
        await pool.query('UPDATE Vehicle SET in_use = TRUE WHERE id = $1', [vehicleId])
        return{ id: results.rows[0].id, status: results.rows[0].status, startedAt, expectedReturn, driver, vehicle }
    }
   
}

/**
 * updates trip status or expected return date
 * @param {*} tripId 
 * @param {*} status 
 * @param {*} expectedReturn 
 * @returns updated trip object
 */
async function updateTrip(tripId, status=undefined, expectedReturn=undefined) {
    let driver,vehicle
    
    if (!tripId) {
        throw new BadRequestError('tripId is required')
    }
    if (status != 'active' && status != 'inactive' && status != undefined) {
        throw new BadRequestError('status must be active or inactive')
    }
    const results = await pool.query(
        'SELECT id FROM Trip WHERE id = $1',
        [tripId]
    )
    if (results.rowCount === 0) {
        throw new BadRequestError(`trip id ${tripId} does not exist`, 404)
    } else {
        let tripQuery = 'UPDATE Trip SET '
        if (status) {
            tripQuery += `status = '${status}'` //prior string validation ensures there is no sql injection vulnerabilities
        }
        if (status && expectedReturn) {
            tripQuery += ', '
        }
        if (expectedReturn) {
            tripQuery += ` expected_return = '${expectedReturn.replaceAll("'", "")}'`
        }
        tripQuery += ' WHERE id = $1 RETURNING *'
    
        const tripResult = await pool.query(tripQuery, [tripId])
        if (tripResult.rowCount === 0) {
            throw BadRequestError(`trip id ${tripId} does not exist`, 404)
        } else {
            try{
                driver = await getDriver(tripResult.rows[0].driver);
                vehicle = await getVehicle(tripResult.rows[0].vehicle)
            }catch(e){
                throw e //pass error on to command
            }
            return {
                id: tripResult.rows[0].id,
                status: tripResult.rows[0].status,
                startedAt: tripResult.rows[0].started_at,
                expectedReturn: tripResult.rows[0].expected_return,
                driver,
                vehicle
            }
            
        }
    }
    

}
module.exports = { getDriver, getVehicle, addDriver, addVehicle, createTrip, getTrip, getManyTrips, updateTrip };