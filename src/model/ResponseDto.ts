import { HttpStatusCode } from "axios";

export interface ResponseDto<T> {
    timeStamp:Date;
    code:HttpStatusCode;
    data:T;
    message:string;
    details:string[];
}