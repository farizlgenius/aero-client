const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `MonitorPoint`;

export const MonitorPointEndpoint = {
    GET:(locationId:number)=> `/api/${API_VERSION}/${locationId}/${CONTROLLER}`,
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api/${API_VERSION}${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    MP_BY_MAC:(mac:string) =>  `/api/${API_VERSION}/${CONTROLLER}/${mac}`,
    CREATE : `/api/${API_VERSION}/${CONTROLLER}`,
    UPDATE:  `/api/${API_VERSION}/${CONTROLLER}`,
    GET_MP_STATUS:(component:number) => `/api/${API_VERSION}/${CONTROLLER}/status/${component}`,
    DELETE :(component:number) => `/api/${API_VERSION}/${CONTROLLER}/${component}`,
    DELETE_RANGE: `/api/${API_VERSION}/${CONTROLLER}/delete/range`,
    IP_LIST :(mac:string,component:number) => `/api/${API_VERSION}/${CONTROLLER}/ip/${mac}/${component}`,
    MASK : `/api/${API_VERSION}/${CONTROLLER}/mask`,
    UNMASK : `/api/${API_VERSION}/${CONTROLLER}/unmask`,
    IP_MODE : `/api/${API_VERSION}/${CONTROLLER}/input/mode`,
    MP_MODE : `/api/${API_VERSION}/${CONTROLLER}/mode`,
    LOG_FUNCTION : `/api/${API_VERSION}/${CONTROLLER}/lf`
} as const;