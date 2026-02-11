const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = 'TimeZone'


export const TimeZoneEndPoint = {
    GET : `/api/${API_VERSION}/${CONTROLLER}`,
    LOCATION:(location:number) => `/api/${API_VERSION}/${location}/${CONTROLLER}`,
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api/${API_VERSION}${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    GET_ID :(component:number) => `/api/${API_VERSION}/${CONTROLLER}/${component}`,
    DELETE :(component:number) => `/api/${API_VERSION}/${CONTROLLER}/${component}`,
    DELETE_RANGE: `/api/${API_VERSION}/${CONTROLLER}/delete/range`,
    UPDATE: `/api/${API_VERSION}/${CONTROLLER}`,
    CREATE : `/api/${API_VERSION}/${CONTROLLER}`,
    GET_MODE : `/api/${API_VERSION}/${CONTROLLER}/mode`,
    COMMAND: `/api/${API_VERSION}/${CONTROLLER}/command`
} as const;