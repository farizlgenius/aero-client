const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `MonitorGroup`;

export const MonitorGroupEndpoint = {
    GET :(location:number) => `/api/${location}/${CONTROLLER}`,
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    GET_TYPE: `/api/${CONTROLLER}/type`,
    CREATE: `/api/${CONTROLLER}`,
    UPDATE : `/api/${CONTROLLER}`,
    DELETE_RANGE: `/api/${CONTROLLER}/delete/range`,
    COMMAND: `/api/${CONTROLLER}/command`,
    DELETE:(mac:string,component:number) => `/api/${CONTROLLER}/${mac}/${component}`
} as const;