const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = 'CardHolder'

// CREDENTIAL
export const CardHolderEndpoint = {
    GET:(locationId:number)=> `/api/${API_VERSION}/${locationId}/${CONTROLLER}`,
     PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api/${API_VERSION}${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    DELETE:(UserId:string)=> `/api/${API_VERSION}/${CONTROLLER}/${UserId}`,
    UPDATE:`/api/${API_VERSION}/${CONTROLLER}`, 
    CREATE:`/api/${API_VERSION}/${CONTROLLER}`,
    SCAN:`/api/${API_VERSION}/${CONTROLLER}/scan`,
    DELETE_RANGE: `/api/${API_VERSION}/${CONTROLLER}/delete/range`,
    UPLOAD:(userid:string) =>`/api/${API_VERSION}/${CONTROLLER}/upload/${userid}`,
    IMAGE:(userId: string) => `/api/${API_VERSION}/${CONTROLLER}/image/${userId}`,
} as const
