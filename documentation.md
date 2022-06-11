
# Smartcar Rental Service

This is a basic usage guide to the Smartcar Rental Service API. If you are looking for a server setup guide, you can find that here:
(https://github.com/wennbergsmithe/smartcar-coding-challenge#readme).

This API is not deployed on a server, so it must be run locally and requests must be made within the same local network.

The API operates by default on port 3002

## Routes
### Get Vehicle By Id
This endpoint will return a vehicle object when supplied with a valid Id.

`GET http://localhost:3002/vehicles:id`

Sample Input:
`GET http://localhost:3002/vehicles/1`

Sample Output:
```
{
	"id":1,
	"make": "Ford"
}
```

### Get Driver By Id
This endpoint will return a driver object when supplied with a valid Id
`GET http://localhost:3002/drivers:id`

Sample Input:
`GET http://localhost:3002/drivers/1`

Sample Output:
```
	"id": "1",
	"driverName": "Ricky Bobby"
```

### Create A Vehicle
This will create a vehicle when supplied with valid input
`POST http://localhost:3002/vehicles`

Sample Input:
```
{
	"make": "honda",
	"model": "civic",
	"year": "2004",
	"mileage": "100000",
	"vin":"12345678",
	"in_use": false
}
```

Sample Output:
```
{
	"id": 1,
	"make": "honda",
	"model": "civic",
	"year": "2004",
	"mileage": "100000",
	"vin": "12345678",
	"in_use": false
}
```

### Create A Driver
This will create a driver when supplied with valid input
`POST http://localhost:3002/drivers`

Sample Input:
```
{
	"name": "Ricky Bobby",
	"licenseNumber": "1334445",
	"phoneNumber": "4158049823"
}
```

Sample Output:
```
{
	"id":1,
	"driverName":"Ricky Bobby"
}
```

### Create a Trip
This creates a new trip with a supplied driver and vehicle. NOTE: While a vehicle can go on multiple trips, it cannot be on more than 1 active trip at a time.
`POST http://localhost:3002/trips`

Sample Input:
```
{
	"vehicleId": "1",
	"driverId": "1",
	"startedAt": "2022-02-24T14:43:18-08:00",
	"expectedReturn": "2022-03-24T14:43:18-08:00",
}
```

Sample Output:
```
{
	"id": 1,
	"status": "active",
	"startedAt": "2021-02-01",
	"expectedReturn": "2021-03-01",
	"driver": {
		"id": 1,
		"name": "Ricky Bobby"
	},
	"vehicle": {
		"id": 1,
		"make": "honda"
	}
}
```

### Get A Single Trip
This will return a trip when supplied with valid id
`GET http://localhost:3002/trips:id`

Sample Input:
`GET http://localhost:3002/trips/1`

Sample Output:
```
{
	"id": 1,
	"status": "active",
	"startedAt": "2021-02-01",
	"expectedReturn": "2021-03-01",
	"driver": {
		"id": 1,
		"name": "Ricky Bobby"
	},
	"vehicle": {
		"id": 1,
		"make": "honda"
	}
}
```

### Get Multiple Trips
This will return multiple trips when supplied  with a status active or inactive
active will return all active trips and inactive will return all inactive trips. 

`GET http://localhost:3002/trips?status=active|inactive`

Sample Input:
`GET http://localhost:3002/trips?status=active`

Sample Output:
```
[
	{
		"id": 1,
		"status": "active",
		"startedAt": "2021-02-01",
		"expectedReturn": "2021-03-01",
		"driver": {
			"id": 1,
			"name": "Ricky Bobby"
		},
		"vehicle": {
			"id": 1,
			"make": "honda"
		}
	},
	{
		"id": 2,
		"status": "active",
		"startedAt": "2021-02-01",
		"expectedReturn": "2021-03-01",
		"driver": {
			"id": 2,
			"name": "Jean Girard"
		},
		"vehicle": {
			"id": 2,
			"make": "ford"
		}
	}
]
```

### Update A Trip
This will the trip of the supplied ID. You can update either the status, the return date, or both.

`PUT http://localhost:3002/trips`

Sample Input:
```
{
	"tripId":1,
	"status":"inactive",
	"expectedReturn":"2022-04-24T14:43:18-08:00"
}
```

Sample Output:
```
{
	"id": "1",
	"status": "inactive",
	"startedAt": "2022-02-24T14:43:18-08:00",
	"expectedReturn": "2022-04-24T14:43:18-08:00",
	"driver":{
		"driverId": "1",
		"driverName": "Ricky Bobby",
	},
	"vehicle": {
		"vehicleId": "1",
		"make": "honda"
	}
}
```
