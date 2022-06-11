const { equal } = require('assert')
var assert = require('assert')
const {getVehicle,getDriver,addVehicle,addDriver,createTrip, getTrip,updateTrip} = require('../src/lib')

describe('LibUnitTests',function() {

    describe('test getters and setters', function(){
        it('tests get driver and add driver function',function(){
            const {id, name} = addDriver("Jenny",123456,8675309)
            const driver = getDriver(id)
            assert.equal(id, driver.id)
            assert.equal(name, driver.name)
        })
        it('throws an error when getting invalid driver',async()=>{
            await assert.rejects(getDriver(1000))
        })
        it('test get vehicle and add vehicle function',function(){
            const {id, make} =  addVehicle("VW","Vanagon",1989,100000,1234,false)
            const vehicle =  getVehicle(id)
            assert.equal(id, vehicle.id)
            assert.equal(make, vehicle.make)
        })
        it('throws an error when getting invalid vehicle',async()=>{
            await assert.rejects(getVehicle(1000))
        })
    })
    describe('tests trip getters and setters',function(){
        it('tests trip setter and getter',function(){
            const {driverId} = addDriver("Ricky Bobby",123,1232322)
            const {vehicleId} = addVehicle("Ford","Racecar",2009,500,1234,false)
            const trip = createTrip(vehicleId, driverId,'2022-02-01','2022-03-01')
            const dbTrip = getTrip(trip.id)
            assert.equal(dbTrip.id, trip.id)
            assert.equal(dbTrip.driver, driverId)
            assert.equal(dbTrip.vehicle, vehicleId)
        })
        it('throws an error when trying to rent a car in use',async()=>{
            const {driverId} = addDriver("Ricky Bobby",123,1232322)
            const {vehicleId} = addVehicle("Ford","Racecar",2009,500,1234,true)
            await assert.rejects(createTrip(vehicleId, driverId,'2022-02-01','2022-03-01'))
        })
    })
    describe('update trip', function(){
        it('updates a trip from active to inactive',async () => {
            const driver = await addDriver("Ricky Bobby",123,1232322)
            const vehicle = await addVehicle("Ford","Racecar",2009,500,1234,false)
            const createdTrip= await createTrip(vehicle.id, driver.id,'2022-02-01','2022-03-01')
            await updateTrip(createdTrip.id,'inactive')
            const updatedTripDb = await getTrip(createdTrip.id)
            assert.equal(updatedTripDb.status, 'inactive')
        })
    })
})