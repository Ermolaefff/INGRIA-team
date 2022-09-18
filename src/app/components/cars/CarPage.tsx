import React, { useEffect, useState } from 'react';
import './Car.css';
import { useParams } from "react-router-dom"
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
            <div>
              <img src={car.image} className='image'/>
              Id: {car.id}
              <br />

              Prod: {car.producer}
              <br />
              Model: {car.model}
              <br />
              <button onClick={() => setEditing(true)}>Edit</button>
              <button onClick={() => onDelete(car.id)}>Delete</button>
            </div> :
            <div>Loading...</div>
          }
        </>
      }
      { editing && carToEdit &&
        <>
          <img src={carToEdit.image}  className='image'/>
          <form onSubmit={handleSubmit}>
            <label>
              Producer:
              <input type="text" name="prod" 
              value={carToEdit.producer}
              onChange={(ev) => handleChange(ev, 'producer')} />
            </label>
            <br />

            <label>
              Model:
              <input type="text" name="model"
              value={carToEdit.model} 
              onChange={(ev) => handleChange(ev, 'model')} />
            </label>
            <br />

            <label>
              Year:
              <input type="number" name="year" 
              value={carToEdit.releaseYear}
              onChange={(ev) => handleChange(ev, 'releaseYear')} />
            </label>
          <br />
            <input type="submit" value="Submit" />
            <button onClick={() => setEditing(false)} >Cancel</button>
          </form>
        </>
      }
    </>
  );
}

export default CarPage;
