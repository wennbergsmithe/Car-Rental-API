const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {pool} = require('./config')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())

const getVehicle = (request, response) => {
    const {id} = request.body
    pool.query('SELECT * FROM Vehicle WHERE id = $1',
    [id],
    (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

app 
    .route('/vehicles')
    .get(getVehicle)

app.listen(3002, () => {
    console.log(`Server listening`)
})