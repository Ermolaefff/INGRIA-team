import datetime as _dt
import pydantic as _pydantic

class _BaseCar(_pydantic.BaseModel):
    car_number : str
    model : str
    owner : int
    odometer : float
 #  picture : str

class Car(_BaseCar):
    id: int
    class Config:
        orm_mode = True

class CreateCar(_BaseCar):
    pass 