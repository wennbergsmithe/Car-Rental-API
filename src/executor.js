const { pool } = require('./config')


const getVehicle = (request, response) => {
    const id = request.params.id
    pool.query('SELECT id,make FROM Vehicle WHERE id = $1',
        [id],
        (error, results) => {
            if (error) {
                throw `ERROR::getVehicle threw an error: ${error}`
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
            }
            response.status(200).json(results.rows[0])
        })
}
const addVehicle = (request, response) => {
    const { make, model, year, mileage, vin, in_use } = request.body

    pool.query(
        'INSERT INTO Vehicle (make, model, year, mileage, vin, in_use) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
        [make, model, year, mileage, vin, in_use],
        (error,results) => {
            if (error) {
                throw `ERROR::addVehicle threw and error: ${error}`
            }
            response.status(201).json({id:results.rows[0].id, make})
        }

    )
}
const addDriver = (request, response) => {
    const { name, licenseNumber, phoneNumber } = request.body

    pool.query(
        'INSERT INTO Driver (name, license_number, phone_number) VALUES ($1,$2,$3) RETURNING id',
        [ name, licenseNumber, phoneNumber ],
        (error,results) => {
            if (error) {
                throw `ERROR::addDriver threw and error: ${error}`
            }
            response.status(201).json({ id: results.rows[0].id, name})
        }

    )
}

module.exports = { getDriver, getVehicle, addDriver, addVehicle };