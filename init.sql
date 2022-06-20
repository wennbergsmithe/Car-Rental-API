CREATE TABLE Vehicle (
    id SERIAL PRIMARY KEY,
    make VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    year VARCHAR(255) NOT NULL,
    mileage INTEGER NOT NULL,
    vin VARCHAR(255),
    in_use BOOLEAN DEFAULT FALSE,
    CONSTRAINT mileage CHECK (mileage >= 0)
);

CREATE TABLE Driver (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(255),
    phone_number VARCHAR(255) NOT NULL
);

CREATE TYPE trip_status AS ENUM ('active', 'inactive');

CREATE TABLE Trip (
    id SERIAL PRIMARY KEY,
    status trip_status NOT NULL,
    started_at TIMESTAMP NOT NULL,
    expected_return TIMESTAMP NOT NULL,
    driver INTEGER NOT NULL,
    vehicle INTEGER NOT NULL,
    CONSTRAINT expected_return check(expected_return > started_at),
    CONSTRAINT fk_driver FOREIGN KEY(driver) REFERENCES Driver(id),
    CONSTRAINT fk_vehicle FOREIGN KEY(vehicle) REFERENCES Vehicle(id)
);

-- starter data
INSERT INTO Driver (name,license_number,phone_number) VALUES ('Ricky Bobby', 10203040, 4151929543);
INSERT INTO Vehicle (make,model,year,mileage,vin,in_use) VALUES ('Ford','Racecar',2009,500,'302D0V820K3',FALSE);
INSERT INTO Trip (status, started_at,expected_return,driver,vehicle) VALUES ('active','2022-01-01', '2022-01-15',1,1);