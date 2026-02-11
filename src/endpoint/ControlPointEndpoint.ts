const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `ControlPoint`;

export const ControlPointEndpoint = {
    GET:(location:number) => `/api/${API_VERSION}/${location}/${CONTROLLER}`,
    DELETE :(component:number) => `/api/${API_VERSION}/${CONTROLLER}/${component}`,
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api/${API_VERSION}${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    TRIGGER : `/api/${API_VERSION}/${CONTROLLER}/trigger`,
    CREATE : `/api/${API_VERSION}/${CONTROLLER}/control`,
    UPDATE : `/api/${API_VERSION}/${CONTROLLER}`,
    STATUS :(mac:string,cpNo:number)=> `/api/${API_VERSION}/${CONTROLLER}/status/${mac}/${cpNo}`,
    OUTPUT : (mac:string,component:number) => `/api/${API_VERSION}/${CONTROLLER}/op/${mac}/${component}`,
    GET_OFFLINE_OP_MODE : `/api/${API_VERSION}/${CONTROLLER}/mode/offline`,
    GET_RELAY_OP_MODE : `/api/${API_VERSION}/${CONTROLLER}/mode/relay`,
    DELETE_RANGE: `/api/${API_VERSION}/${CONTROLLER}/delete/range`
} as const;

