import React, { useEffect, useState } from 'react';
import './Car.css';
import {Link, useParams} from "react-router-dom"
import { Api } from '../../../services/api.service';
import { Car } from '../../../interfaces/car' 
import { useNavigate } from "react-router-dom";

function CarPage() {
  const api = new Api();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car>();
  const [carToEdit, setCarToEdit] = useState<Car>();
  const [editing, setEditing] = useState<boolean>(false)
  
  let { id } = useParams();
  
  const getCar = (id: string) => {
    api.getCar(id).then(res => {
      setCar(res);
      setCarToEdit(res);
    });
  }
  
  useEffect(() => {
    if(id) getCar(id)
  }, [id])

  function handleChange(event: any, field: string){
    if(carToEdit)
      setCarToEdit(
        {
          ...carToEdit, 
          [field]: (event.target as HTMLInputElement).value
        }
      );
  }

  function onDelete(id: string){
    //TODO here would be deleting request
    navigate('/');
  }

  function handleSubmit(){
    //TODO here would be put request
    setCar(carToEdit)
    setEditing(false);
  }

  return (
    <>
      { !editing &&
        <>
          {car ?
            <>
              <Link to="/"><button className="back-button"> Back </button></Link>
              <div>
                <img src={car.image} className='image'/>
                <p className='information'>
                  Number: {car.number} <br/>
                  Model: {car.model} <br/>
                  Owner: {car.owner} <br/>
                  Odometer: {car.odometer}
                  <br/>
                  <button className="edit-button" onClick={() => setEditing(true)}>Edit</button>
                  <button className="edit-button" onClick={() => onDelete(car.number)}>Delete</button>
                </p>
              </div>
            </>
              :
            <div>Loading...</div>
          }
        </>
      }
      { editing && carToEdit &&
        <>
          <Link to="/"><button className="back-button"> Back </button></Link>
          <div className="car-block">
            <img src={carToEdit.image}  className='image'/>
            <p className="information">
              <form onSubmit={handleSubmit} >
                <label>
                  Number:
                  <input className="edit-input" type="text" name="number"
                         value={carToEdit.number}
                         onChange={(ev) => handleChange(ev, 'producer')} />
                </label>
                <br />

                <label>
                  Model:
                  <input className="edit-input" type="text" name="model"
                  value={carToEdit.model}
                  onChange={(ev) => handleChange(ev, 'model')} />
                </label>
                <br />
                <label>
                  Owner:
                  <input className="edit-input" type="text" name="owner"
                         value={carToEdit.owner}
                         onChange={(ev) => handleChange(ev, 'producer')} />
                </label>
                <br />

                <label>
                  Odometer:
                  <input className="edit-input" type="number" name="odometer"
                  value={carToEdit.odometer}
                  onChange={(ev) => handleChange(ev, 'releaseYear')} />
                </label>
                <br />
                <input className="edit-button" type="submit" value="Submit" />
                <button className="edit-button" onClick={() => setEditing(false)} >Cancel</button>
              </form>
            </p>
          </div>
        </>
      }
    </>
  );
}

export default CarPage;
