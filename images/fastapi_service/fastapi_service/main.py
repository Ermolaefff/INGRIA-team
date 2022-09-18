from typing import TYPE_CHECKING, List
import fastapi as _fastapi
import uvicorn as _uvicorn
import sqlalchemy.orm as _orm
import os as _os

import schemas as _schemas
import services as _services

if TYPE_CHECKING:
    from sqlalchemy.orm import Session

app = _fastapi.FastAPI()

@app.post("/api/")
async def create_table():
    _services._add_tables()

@app.post("/api/cars/", response_model=_schemas.Car)
async def create_car(
    car: _schemas.CreateCar, 
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_car(car=car, db=db)

@app.get("/api/cars/", response_model=List[_schemas.Car])
async def get_car(db:_orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_all_cars(db=db)

@app.get("/api/cars/{car_id}/", response_model=_schemas.Car)
async def get_car(
    car_id: int, db:_orm.Session = _fastapi.Depends(_services.get_db)
):
    car = await _services.get_car(car_id=car_id, db=db)
    if car is None:
        raise _fastapi.HTTPException(status_code=404, detail="Car does not exist")
        
    return car

@app.delete("/api/cars/{car_id}/")
async def delete_car(
    car_id: int, db:_orm.Session = _fastapi.Depends(_services.get_db)
):
    car = await _services.get_car(db=db, car_id=car_id)
    if car is None:
        raise _fastapi.HTTPException(status_code=404, detail="Contact does not exist")

    await _services.delete_car(car, db=db)
    return "The car was deleted"

@app.put("/api/cars/{car_id}/", response_model=_schemas.Car)
async def update_car(
    car_id: int, 
    car_data: _schemas.CreateCar,
    db:_orm.Session = _fastapi.Depends(_services.get_db),
):
    car = await _services.get_car(db=db, car_id=car_id)
    if car is None:
        raise _fastapi.HTTPException(status_code=404, detail="Car does not exist")
        
    return await _services.update_contact(car_data=car_data, car=car, db=db)

if __name__ == "__main__":
    _uvicorn.run("main:app", host="0.0.0.0", port=_os.getenv("PORT", 8002))