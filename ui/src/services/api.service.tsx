import { rejects } from 'assert';
import { Car } from '../interfaces/car'
// import { cars } from '../mock/mock_server';

const serverUrl = 'http://localhost:8002';
export class Api {
    makeRequest<T>(options: {
        method: 'POST' | 'PUT' | "GET" | 'DELETE',
        endpoint: string,
        body?: any,
        options?: any
    }): Promise<T>{
        return fetch(options.endpoint, {...options.options, method: options.method, body: options.body}).then(res => res.json())
    }


    getCars(page: number = 1, per_page: number = 2): Promise<Car[]>{
        return this.makeRequest({
            endpoint:  `${serverUrl}/api/car?page=${page}&per_page=${per_page}`,
            method: 'GET',
        })
    }

    getCar(id: string | number): Promise<Car>{
        return this.makeRequest({
            endpoint:  `${serverUrl}/api/car/${id}`,
            method: 'GET',
        })
    }

    postCar(id: string, car: Car): Promise<Car>{
        return this.makeRequest({
            endpoint:  `${serverUrl}/api/car/${id}`,
            method: 'POST',
            body: car
        })
    }

    putCar(id: string, car: Car): Promise<Car>{
        return this.makeRequest({
            endpoint:  `${serverUrl}/api/car/${id}`,
            method: 'PUT',
            body: car
        })
    }

    deleteCar(id: string): Promise<{succsess: boolean}>{
        return this.makeRequest({
            endpoint:  `${serverUrl}/api/car/${id}`,
            method: 'DELETE',
        })
    }

}