const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Module`;

export const ModuleEndpoint = {
    GET:(location:number) => `/api/${API_VERSION}/${location}/${CONTROLLER}`,
    GET_ID:(id:number) => `/api/${API_VERSION}/${CONTROLLER}/${id}`,
    GET_MAC:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/${mac}`,
    STATUS:(mac:string,ModuleId:number) => `/api/${API_VERSION}/${CONTROLLER}/status/${mac}/${ModuleId}`,
    BAUDRATE: `/api/${API_VERSION}/${CONTROLLER}/baudrate`,
    PROTOCOL : `/api/${API_VERSION}/${CONTROLLER}/protocol`

} as const;