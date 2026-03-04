const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = 'TimeZone'


export const TimeZoneEndPoint = {
    GET : `/api/${CONTROLLER}`,
    LOCATION:(location:number) => `/api/${location}/${CONTROLLER}`,
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    GET_ID :(component:number) => `/api/${CONTROLLER}/${component}`,
    DELETE :(component:number) => `/api/${CONTROLLER}/${component}`,
    DELETE_RANGE: `/api/${CONTROLLER}/delete/range`,
    UPDATE: `/api/${CONTROLLER}`,
    CREATE : `/api/${CONTROLLER}`,
    GET_MODE : `/api/${CONTROLLER}/mode`,
    COMMAND: `/api/${CONTROLLER}/command`
} as const;