
const CONTROLLER = "Transaction";

export const TransactionEndpoint = {
    GET:(pageNumber:number,pageSize:number,locationId:number,search?:string,startDate?:string,endDate?:string) => `/api/${locationId}/${CONTROLLER}?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&endDate=${endDate}`}`,
    SOURCE: `/api/${CONTROLLER}/source`,
    DEVICE:(source:number) => `/api/${CONTROLLER}/device/${source}`,
} as const;