const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `AccessArea`;

export const AreaEndpoint = {
    GET:(locationId:number) => `/api/${API_VERSION}/${locationId}/${CONTROLLER}`, 
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api/${API_VERSION}${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    CREATE:`/api/${API_VERSION}/${CONTROLLER}`,
    DELETE:(component:number) => `/api/${API_VERSION}/${CONTROLLER}/${component}`,
    DELETE_RANGE: `/api/${API_VERSION}/${CONTROLLER}`,
    UPDATE:`/api/${API_VERSION}/${CONTROLLER}`,
    GET_ACCESS_CONTROL:`/api/${API_VERSION}/${CONTROLLER}/access`,
    GET_OCC_CONTROL:`/api/${API_VERSION}/${CONTROLLER}/occcontrol`,
    GET_ARE_FLAG:`/api/${API_VERSION}/${CONTROLLER}/areaflag`,
    GET_MULTI_OCC:`/api/${API_VERSION}/${CONTROLLER}/multiocc`,
} as const;