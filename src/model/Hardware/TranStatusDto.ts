export interface TranStatusDto {
    capacity:number;
    oldest:number;
    lastReport:number;
    lastLog:number;
    disabled:number;
    macAddress:string;
    status:string;
}