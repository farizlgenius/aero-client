import { TransactionFlagDto } from "./TransactionFlagDto";

export interface TransactionDto{
    date:string;
    time:string;
    serialNumber:number;
    actor:string;
    source:number;
    sourceDesc:number;
    origin:string;
    sourceModule:string;
    type:number;
    typeDesc:string;
    tranCode:number;
    image:string;
    tranCodeDesc:string;
    extendDesc:string;
    remark:number;
    transactionFlags:TransactionFlagDto[];
}