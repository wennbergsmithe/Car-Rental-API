const chai = require("chai")
const chaiHttp = require("chai-http")
const expect = chai.expect
chai.use(chaiHttp)
const app = require('../src/app')
const {addVehicle,addDriver,createTrip} = require('../src/lib')

describe("/drivers", () => {
    after(async()=>{
        app.stop()
    })
	it("should return status 200", async () => {
    	let res = await chai
        	.request(app)
        	.post('/drivers')
        	.send({
                name: "miller",
                licenseNumber: "123456",
                phoneNumber: "123445"
            })
       
    	expect(res.status).to.equal(201)
       
	})
    it("should return status 404", async () => {
    	let res = await chai
        	.request(app)
        	.post('/drivers/10000')
        	.send()
       
    	expect(res.status).to.equal(404)
       
	})
})
describe("PUT /trips",()=>{
	before(async()=>{
		const {driverId} = addDriver("Ricky Bobby",123,1232322)
		const {vehicleId} = addVehicle("Ford","Racecar",2009,500,1234,false)
		const trip = createTrip(vehicleId, driverId,'2022-02-01','2022-03-01')
	})
    it("should return status code 200",async()=>{
        let res = await chai
        	.request(app)
        	.put('/trips')
        	.send({
                tripId:1,
                status:"inactive"
            })
       
    	expect(res.status).to.equal(200)
    })
    it("should return status code 400",async()=>{
        let res = await chai
        	.request(app)
        	.put('/trips')
        	.send({
                status:"inactive"
            })
       
    	expect(res.status).to.equal(400)
    })
})
