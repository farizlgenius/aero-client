export interface TranStatusDto {
    capacity:number;
    oldest:number;
    lastReport:number;
    lastLog:number;
    disabled:number;
    driverId:number;
    status:string;
}