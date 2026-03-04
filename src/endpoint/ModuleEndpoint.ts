const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Module`;

export const ModuleEndpoint = {
    GET:(location:number) => `/api/${location}/${CONTROLLER}`,
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    CREATE:`/api/${CONTROLLER}`,
    GET_ID:(id:number) => `/api/${CONTROLLER}/${id}`,
    GET_MAC:(mac:string) => `/api/${CONTROLLER}/${mac}`,
    STATUS:(mac:string,ModuleId:number) => `/api/${CONTROLLER}/status/${mac}/${ModuleId}`,
    BAUDRATE: `/api/${CONTROLLER}/baudrate`,
    PROTOCOL : `/api/${CONTROLLER}/protocol`

} as const;