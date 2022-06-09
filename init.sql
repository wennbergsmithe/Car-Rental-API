CREATE TABLE Vehicle (
    id SERIAL PRIMARY KEY,
    make VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    year VARCHAR(255) NOT NULL,
    mileage INTEGER NOT NULL,
    vin VARCHAR(255),
    CONSTRAINT mileage CHECK (mileage >= 0),
    in_use BOOLEAN DEFAULT FALSE
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