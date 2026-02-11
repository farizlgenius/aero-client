const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Module`;

export const ModuleEndpoint = {
    GET:(location:number) => `/api/${API_VERSION}/${location}/${CONTROLLER}`,
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api/${API_VERSION}${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    CREATE:`/api/${API_VERSION}/${CONTROLLER}`,
    GET_ID:(id:number) => `/api/${API_VERSION}/${CONTROLLER}/${id}`,
    GET_MAC:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/${mac}`,
    STATUS:(mac:string,ModuleId:number) => `/api/${API_VERSION}/${CONTROLLER}/status/${mac}/${ModuleId}`,
    BAUDRATE: `/api/${API_VERSION}/${CONTROLLER}/baudrate`,
    PROTOCOL : `/api/${API_VERSION}/${CONTROLLER}/protocol`

} as const;