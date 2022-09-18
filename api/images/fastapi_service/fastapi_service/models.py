import datetime as _dt
from email.policy import default
from enum import unique
from textwrap import indent
import sqlalchemy as _sql

import database as _database

class Car(_database.Base):
    __tablename__="car"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    car_number = _sql.Column(_sql.String, index=True, unique=True)
    model = _sql.Column(_sql.String, index=True)
    owner = _sql.Column(_sql.Integer, index=True)
    odometer = _sql.Column(_sql.Integer, index=True)
#   picture = _sql.Column(_sql.String, index=True)