const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = "Transaction";

export const TransactionEndpoint = {
    GET:(pageNumber:number,pageSize:number,locationId:number,search?:string,startDate?:string,endDate?:string) => `/api/${API_VERSION}/${locationId}/${CONTROLLER}?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`
} as const;