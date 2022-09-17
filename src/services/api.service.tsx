import { rejects } from 'assert';
import { Car } from '../interfaces/car'
import { cars } from '../mock/mock_server';

export class Api {

    getCars(page: number = 1, per_page: number = 2): Promise<Car[]>{
        // fetch('').then(res => res.json())
        return new Promise<Car[]>((resolve, reject) => {
            let slice = cars.slice((page-1) * per_page, page * per_page)

            if(slice.length){
                // console.log('Slice:', slice)
                resolve(slice);
            }
            else
                reject(new Error('No more cars!'))
        });
    }

    getCar(id: string | number): Promise<Car>{
        return new Promise<Car>( (resolve, reject) => {
            let car = cars.find(c => c.id == id);

            if(car) resolve(car);
            else reject(new Error('Not found!'));
        });
    }

    putCar(id: string, car: Car): Promise<Car>{
        return new Promise<Car>( (resolve, reject) => {
            resolve(car);
        });
    }

    deleteCar(id: string): Promise<{succsess: boolean}>{
        return new Promise<{succsess: boolean}>((resolve, reject) => {
            resolve({succsess: true});
        });
    }

}