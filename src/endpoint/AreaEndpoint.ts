const CONTROLLER = `AccessArea`;

export const AreaEndpoint = {
    GET:(locationId:number) => `/api/${locationId}/${CONTROLLER}`, 
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    CREATE:`/api/${CONTROLLER}`,
    DELETE:(component:number) => `/api/${CONTROLLER}/${component}`,
    DELETE_RANGE: `/api/${CONTROLLER}`,
    UPDATE:`/api/${CONTROLLER}`,
    GET_ACCESS_CONTROL:`/api/${CONTROLLER}/access`,
    GET_OCC_CONTROL:`/api/${CONTROLLER}/occcontrol`,
    GET_ARE_FLAG:`/api/${CONTROLLER}/areaflag`,
    GET_MULTI_OCC:`/api/${CONTROLLER}/multiocc`,
} as const;