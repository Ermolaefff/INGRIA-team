from typing import TYPE_CHECKING, List

import database as _database
import models as _models
import schemas as _schemas

if TYPE_CHECKING:
    from sqlalchemy.orm import Session

def _add_tables():
    return _database.Base.metadata.create_all(bind=_database.engine)

def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def create_car(
    car: _schemas.CreateCar, db: "Session"
) -> _schemas.Car:
    car = _models.Car(**car.dict())
    db.add(car)
    db.commit()
    db.refresh(car)
    return _schemas.Car.from_orm(car)

async def get_all_cars(db: "Session") -> List[_schemas.Car]:
    cars = db.query(_models.Car).all()
    return list(map(_schemas.Car.from_orm, cars))

async def get_car(car_id: int, db: "Session"):
    car = db.query(_models.Car).filter(_models.Car.id == car_id).first()
    return car

async def delete_car(car: _models.Car, db: "Session"):
    db.delete(car)
    db.commit()

async def update_car(
    car_data: _schemas.CreateCar, car: _models.Car, db: "Session"
) -> _schemas.Car:
    car.car_number = car_data.car_number
    car.model = car_data.model
    car.owner = car_data.owner
    car.odometer = car_data.odometer

    db.commit()
    db.refresh(car)

    return _schemas.Car.from_orm(car)
    