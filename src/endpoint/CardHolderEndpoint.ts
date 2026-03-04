const CONTROLLER = 'CardHolder'

// CREDENTIAL
export const CardHolderEndpoint = {
    GET:(locationId:number)=> `/api/${locationId}/${CONTROLLER}`,
     PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    DELETE:(UserId:string)=> `/api/${CONTROLLER}/${UserId}`,
    UPDATE:`/api/${CONTROLLER}`, 
    CREATE:`/api/${CONTROLLER}`,
    SCAN:`/api/${CONTROLLER}/scan`,
    DELETE_RANGE: `/api/${CONTROLLER}/delete/range`,
    UPLOAD:(userid:string) =>`/api/${CONTROLLER}/upload/${userid}`,
    IMAGE:(userId: string) => `/api/${CONTROLLER}/image/${userId}`,
} as const
