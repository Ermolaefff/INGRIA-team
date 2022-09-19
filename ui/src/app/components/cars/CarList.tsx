import React, {useContext, useEffect, useState} from 'react';
import './Car.css';
import { Car } from '../../../interfaces/car';
import { Link } from 'react-router-dom';
import { Api } from '../../../services/api.service';
import {CreateCar} from "../creation/CreateCar";
import {Modal} from "../Modal";
import {ModalContext} from "../../ModalContext/ModalContext";



function CarList() {
    const api = new Api(); 
    
    const [cars, setCars] = useState<Car[]>([]);
    const [carDataSource, setCarDataSource] = useState<Car[]>([]);
    const [search, setSearch] = useState<string>('');
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const {modal, open, close} = useContext(ModalContext);
    
    const getCars = (page: number = 1, per_page: number = 10) => {
        setLoading(true)
        api.getCars(page, per_page)
        .then(res => {
            setCars(cars.concat(res));
            console.log(res)
        })
        .catch(err => {
            setScrolled(true)
        })
        .finally(() => {
            setLoading(false);
        });
        // console.log("loadDataOnlyOnce");
    }

    function onSearch(search: string){
        if(search.length){
            setCarDataSource(getSearch(search));
        } else {
            setCarDataSource([]);
        }
    }

    function getSearch(search: string){
        return cars.filter(car => {
            const s = search.toLocaleLowerCase();
            return car.odometer.toString().includes(s) ||
            car.model.toLocaleLowerCase().includes(s) ||
            car.number?.toString().includes(s) ||
            car.owner?.toString().includes(s)
        })
    }

    useEffect(() => {
        getCars(page);
    }, [page])


    useEffect(() => {
        // console.log(bottom);
        const bottom = document.getElementById('bottom') as HTMLDivElement;
        
        let onscroll = (ev: any) => {  
            console.log(loading,scrolled)         
            if(!loading && !scrolled && isInViewport(bottom)){
                setPage(page + 1);
            } 
        }
        
        document.addEventListener('scroll', onscroll);
        return () => document.removeEventListener('scroll', onscroll);
    },[])


    return (
        <>
            <h1>Cars DB</h1>
            <div className='search'>
                <label htmlFor="Search">
                    <img src="/images/search_black_24dp.svg" alt="" />
                </label>
                <input id='search' type='text' name='Search' placeholder='Search here'
                onChange={(ev) => onSearch(ev.target.value)}/>
                <br/>
                <button onClick ={open} className="create-button">Create Car Note</button>
                { !!carDataSource.length &&
                    <div className='searchResults'>
                        {carDataSource.map(car => 
                            <Link to={'/car/' + car.number} className='carCard' key={'car-' + car.number}>
                            <span className='cardElement'>{car.number}</span>
                            <span className='cardElement'>{car.model}</span>
                            <span className='cardElement'>{car.owner}</span>
                            <span className='cardElement'>{car.odometer}</span>
                            </Link>)
                        }
                    </div>  
                }
            </div>

            <div className="header">
                <span className='cardElement'>Number</span>
                <span className='cardElement'>Model</span>
                <span className='cardElement'>Owner</span>
                <span className='cardElement'>Odometer</span>
            </div>
            <div className='container'>
                { cars.map(car => (
                    <Link to={'/car/' + car.number} className='carCard' key={'car-' + car.number}>
                        <span className='cardElement'>{car.number}
                        </span>
                        <span className='cardElement'>{car.model}</span>
                        <span className='cardElement'>{car.owner}</span>
                        <span className='cardElement'>{car.odometer}</span>
                    </Link>
                ))}
            </div>
        
            <div id='bottom' style={{width: '100%', height: '1px'}}>
            </div>

            {modal && <Modal title="Create car information" onClose = {close}>
                <CreateCar onCreate={close} />
            </Modal>}
        </>
  );
}

function isInViewport(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}


export default CarList;
