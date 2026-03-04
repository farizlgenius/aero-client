const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `MonitorPoint`;

export const MonitorPointEndpoint = {
    GET:(locationId:number)=> `/api/${locationId}/${CONTROLLER}`,
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    MP_BY_MAC:(mac:string) =>  `/api/${CONTROLLER}/${mac}`,
    CREATE : `/api/${CONTROLLER}`,
    UPDATE:  `/api/${CONTROLLER}`,
    GET_MP_STATUS:(component:number) => `/api/${CONTROLLER}/status/${component}`,
    DELETE :(component:number) => `/api/${CONTROLLER}/${component}`,
    DELETE_RANGE: `/api/${CONTROLLER}/delete/range`,
    IP_LIST :(mac:string,component:number) => `/api/${CONTROLLER}/ip/${mac}/${component}`,
    MASK : `/api/${CONTROLLER}/mask`,
    UNMASK : `/api/${CONTROLLER}/unmask`,
    IP_MODE : `/api/${CONTROLLER}/input/mode`,
    MP_MODE : `/api/${CONTROLLER}/mode`,
    LOG_FUNCTION : `/api/${CONTROLLER}/lf`
} as const;