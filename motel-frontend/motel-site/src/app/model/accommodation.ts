export class Accommodation {
    id?: number;
    acreage!: number;
    address!: string;
    toilet?: string;
    internet?: boolean
    parking?: boolean
    airConditioner?: boolean
    heater?: boolean
    tv?: boolean
    price!: number
    status?: boolean
    categoryId?: number;
    postId?: number;
    xcoordinate?: number;
    ycoordinate?: number;
}