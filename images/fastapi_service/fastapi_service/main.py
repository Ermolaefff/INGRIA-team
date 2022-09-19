from typing import TYPE_CHECKING, List
from fastapi.middleware.cors import CORSMiddleware as _cors

import fastapi as _fastapi
import uvicorn as _uvicorn
import sqlalchemy.orm as _orm
import os as _os
import schemas as _schemas
import services as _services

if TYPE_CHECKING:
    from sqlalchemy.orm import Session

app = _fastapi.FastAPI()

origins = [
    "http://localhost",
    "https://localhost",
    "http://localhost:3000"
]

app.add_middleware(
    _cors,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/car/", response_model=_schemas.Car)
async def create_car(
    car: _schemas.CreateCar, 
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_car(car=car, db=db)

@app.get("/api/car/{car_id}/", response_model=_schemas.Car)
async def get_car(
    car_id: int, db:_orm.Session = _fastapi.Depends(_services.get_db)
):
    car = await _services.get_car(car_id=car_id, db=db)
    if car is None:
        raise _fastapi.HTTPException(status_code=404, detail="NOT FOUND")
        
    return car

@app.delete("/api/car/{car_id}/")
async def delete_car(
    car_id: int, db:_orm.Session = _fastapi.Depends(_services.get_db)
):
    car = await _services.get_car(db=db, car_id=car_id)
    if car is None:
        raise _fastapi.HTTPException(status_code=404, detail="NOT FOUND")

    await _services.delete_car(car, db=db)
    return "The car was deleted"

@app.get("/api/car/", response_model=List[_schemas.Car])
async def get_cars(
    page: int, 
    per_page : int,
    db:_orm.Session = _fastapi.Depends(_services.get_db)
):
    return await _services.get_cars(page=page, per_page=per_page, db=db)       

@app.put("/api/car/{car_id}/", response_model=_schemas.Car)
async def update_car(
    car_id: int, 
    car_data: _schemas.CreateCar,
    db:_orm.Session = _fastapi.Depends(_services.get_db),
):
    car = await _services.get_car(db=db, car_id=car_id)
    if car is None:
        raise _fastapi.HTTPException(status_code=404, detail="NOT FOUND")

    car_by_number = await _services.get_car_by_number(db=db, car_number=car_data.car_number)
    if not car_by_number is None:
        raise _fastapi.HTTPException(status_code=300, detail="SUCH CAR NUMBER ALREADY EXISTS")

    return await _services.update_car(car_data=car_data, car=car, db=db)

if __name__ == "__main__":
    _services._add_table()
    _uvicorn.run("main:app", host="0.0.0.0", port=_os.getenv("PORT", 8002))