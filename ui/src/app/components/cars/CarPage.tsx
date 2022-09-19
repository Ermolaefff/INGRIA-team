import React, { useEffect, useState } from 'react';
import './Car.css';
import {Link, useParams} from "react-router-dom"
import { Api } from '../../../services/api.service';
import { Car } from '../../../interfaces/car' 
import { useNavigate, useLocation } from "react-router-dom";

function CarPage() {
  const api = new Api();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car>();
  const [carToEdit, setCarToEdit] = useState<Car>();
  const [editing, setEditing] = useState<boolean>(false)

  const search = useLocation().search;

  useEffect(() => {
    const ed = new URLSearchParams(search).get('editing');
    setEditing(!!ed)
  })

  let { id } = useParams();
  
  const getCar = (id: string) => {
    api.getCar(id).then(res => {
      setCar(res);
      setCarToEdit(res);
    }).catch(err => {
      alert(err);
      window.location.href = '/';
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

  function onDelete(id: number){
    api.deleteCar(id).then(res => {
      navigate('/');
    })
  }

  function onEdit(){
    navigate('?editing=true');
    setEditing(true);
  }

  function onCancel(){
    navigate('');
    setEditing(false);
    setCarToEdit(car)
  }

  function handleSubmit(){
    if(carToEdit)
      api.putCar(carToEdit).then(res => {
        setCar(res);
        setCarToEdit(res);
        navigate('');
        setEditing(false);
      })
  }

  function onAddPucture(ev: any){
    const file = ev.target.files[0];

    const reader = new FileReader()
    reader.onloadend = () => {
      if(carToEdit)
        setCarToEdit({
        ...carToEdit,
        picture: reader.result ? reader.result.toString() : ''
      })
    }

    reader.readAsDataURL(file)
  }

  return (
    <>
      { !editing &&
        <>
          {car ?
            <>
              <Link to="/"><button className="back-button"> Back </button></Link>
              <div>
                {/* <img src={car.model} className='image'/> */}
                <p className='information'>
                  Number: {car.car_number} <br/>
                  Model: {car.model} <br/>
                  Owner: {car.owner} <br/>
                  Odometer: {car.odometer}
                  <br/>
                  <button className="edit-button" onClick={onEdit}>Edit</button>
                  <button className="edit-button" onClick={() => onDelete(car.id)}>Delete</button>
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
            {/* <input type="file" onChange={(ev) => onAddPucture(ev)}/> */}
            {/* <img src={carToEdit.picture}  className='image'/> */}
            <div className="information">
              <form onSubmit={(ev) => {
                ev.preventDefault();
                handleSubmit();
              }} >
                <label>
                  Number:
                  <input className="edit-input" type="text" name="number"
                         value={carToEdit.car_number}
                         onChange={(ev) => handleChange(ev, 'car_number')} />
                </label>
                <br />

                <label>
                  Model:
                  <input className="edit-input" type="text" name="model"
                  value={carToEdit.picture}
                  onChange={(ev) => handleChange(ev, 'model')} />
                </label>
                <br />
                <label>
                  Owner:
                  <input className="edit-input" type="text" name="owner"
                         value={carToEdit.owner}
                         onChange={(ev) => handleChange(ev, 'owner')} />
                </label>
                <br />

                <label>
                  Odometer:
                  <input className="edit-input" type="number" name="odometer"
                  value={carToEdit.odometer}
                  onChange={(ev) => handleChange(ev, 'odometer')} />
                </label>
                <br />
                <input className="edit-button" type="submit" value="Submit" />
                <button className="edit-button" onClick={onCancel} >Cancel</button>
              </form>
            </div>
          </div>
        </>
      }
    </>
  );
}

export default CarPage;
