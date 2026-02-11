const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `MonitorGroup`;

export const MonitorGroupEndpoint = {
    GET :(location:number) => `/api/${API_VERSION}/${location}/${CONTROLLER}`,
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api/${API_VERSION}${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    GET_TYPE: `/api/${API_VERSION}/${CONTROLLER}/type`,
    CREATE: `/api/${API_VERSION}/${CONTROLLER}`,
    UPDATE : `/api/${API_VERSION}/${CONTROLLER}`,
    DELETE_RANGE: `/api/${API_VERSION}/${CONTROLLER}/delete/range`,
    COMMAND: `/api/${API_VERSION}/${CONTROLLER}/command`,
    DELETE:(mac:string,component:number) => `/api/${API_VERSION}/${CONTROLLER}/${mac}/${component}`
} as const;