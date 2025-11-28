import { LocationDto } from "../Location/LocationDto";

export interface OperatorDto{
    componentId:number;
    username:string;
    password:string;
    email:string;
    title:string;
    firstName:string;
    middleName:string;
    lastName:string;
    phone:string;
    imagePath:string;
    roleId:number;
    locationIds:number[];
}
