import React, {useContext, useEffect, useState} from 'react';
import './Car.css';
import { Car } from '../../../interfaces/car';
import { Link, useNavigate } from 'react-router-dom';
import { Api } from '../../../services/api.service';
import {CreateCar} from "../creation/CreateCar";
import {Modal} from "../Modal";
import {ModalContext} from "../../ModalContext/ModalContext";



function CarList() {
    const api = new Api(); 
    const navigate = useNavigate();
    const [cars, setCars] = useState<Car[]>([]);
    const [carDataSource, setCarDataSource] = useState<Car[]>([]);
    const [search, setSearch] = useState<string>('');
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [isFetching, setIsFetching] = useState(true);
    
    // const {modal, open, close} = useContext(ModalContext);
    
    const getCars = () => {
        // api.getCars(page)
        // .then(res => {
        //     if(!res.length) setScrolled(true);
        //     setCars(cars.concat(res));
        //     setPage(page + 1);
        // })
        // .catch(err => {
        //     setScrolled(true)
        //     console.log(err)
        // })
        // .finally(() => {
        //     setIsFetching(false);
        // });
        // // console.log("loadDataOnlyOnce");
        api.getCars(page).then(res => {
            if(!res.length) setScrolled(true);
            setCars(cars.concat(res))
            setPage(page + 1)
            
           }).finally(() => {
            setIsFetching(false);
           })

        
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
            car.car_number?.toString().includes(s) ||
            car.owner?.toString().includes(s)
        })
    }

    function onCreateCar(){
        api.postCar({
            id: 0,
            car_number: '',
            model: '',
            owner: 0,
            odometer: 0,
        }).then(res => navigate(`/car/${res.id}?editing=true`));
    }

    
    function handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight) return;
        if(!scrolled)
            setIsFetching(true);
    }
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!isFetching) return;
        getCars();
      }, [isFetching])


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
                { !!carDataSource.length &&
                    <div className='searchResults'>
                        {carDataSource.map(car => 
                            <Link to={'/car/' + car.id} className='carCard' key={'car-' + car.car_number}>
                            <span className='cardElement'>{car.car_number}</span>
                            <span className='cardElement'>{car.model}</span>
                            <span className='cardElement'>{car.owner}</span>
                            <span className='cardElement'>{car.odometer}</span>
                            </Link>)
                        }
                    </div>  
                }
                <button onClick ={onCreateCar} className="create-button">Create Car Note</button>
            </div>

            <div className="header">
                <span className='cardElement'>Number</span>
                <span className='cardElement'>Model</span>
                <span className='cardElement'>Owner</span>
                <span className='cardElement'>Odometer</span>
            </div>
            <div className='container'>
                { cars.map(car => (
                    <Link to={'/car/' + car.id} className='carCard' key={'car-' + car.car_number}>
                        <span className='cardElement'>{car.car_number}
                        </span>
                        <span className='cardElement'>{car.model}</span>
                        <span className='cardElement'>{car.owner}</span>
                        <span className='cardElement'>{car.odometer}</span>
                    </Link>
                ))}
            </div>
        
            <div id='bottom' 
            style={{width: '100%', height: '5px', marginBottom: "10px"}}>
            </div>

            {isFetching && !scrolled &&
                <div>Loading...</div>
            }

            {scrolled &&
                <div style={{textAlign: 'center', width: '100%'}}>
                    <span className='loadMore' onClick={() => {setScrolled(false); getCars(); }}>Try to load more cars</span>
                </div>
            }   

            {/* {modal && <Modal title="Create car information" onClose = {close}>
                <CreateCar onCreate={close} />
            </Modal>} */}
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
