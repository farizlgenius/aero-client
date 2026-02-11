const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Interval`;

export const IntervalEndpoint = {
    GET : `/api/${API_VERSION}/${CONTROLLER}` ,
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api/${API_VERSION}${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    LOCATION: (location:number) => `/api/${API_VERSION}/${location}/${CONTROLLER}`,
    CREATE : `/api/${API_VERSION}/${CONTROLLER}`,
    DELETE :(component:number) => `/api/${API_VERSION}/${CONTROLLER}/${component}`,
    UPDATE : `/api/${API_VERSION}/${CONTROLLER}`,
    DELETE_RANGE:`/api/${API_VERSION}/${CONTROLLER}/delete/range`
} as const;