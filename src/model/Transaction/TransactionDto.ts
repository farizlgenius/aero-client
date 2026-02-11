import { TransactionFlagDto } from "./TransactionFlagDto";

export interface TransactionDto{
    actor:string;
    componentId:number;
    dateTime:string;
    extendDesc:string;
    hardwareName:string;
    image:string;
    isActive:boolean;
    locationId:number;
    mac:string;
    origin:string;
    remark:string;
    serialNumber:number;
    source:number;
    sourceDesc:number;
    sourceModule:string;
    type:number;
    typeDesc:string;
    tranCode:number;
    tranCodeDesc:string;
    transactionFlags:TransactionFlagDto[];
}