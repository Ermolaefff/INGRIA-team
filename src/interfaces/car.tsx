export interface Car{
    id: string,
    
    producer: string,
    model: string,
    
    color?: string,
    num?: string,

    owner?: string,
    
    maxSpeed?: number,
    releaseYear?: number,
    image?: string
}