const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Module`;

export const ModuleEndpoint = {
    GET_MODULE:(location:number) => `/api/${API_VERSION}/${location}/${CONTROLLER}`,
    GET_MODULE_BY_ID:(id:number) => `/api/${API_VERSION}/${CONTROLLER}/${id}`,
    GET_MODULE_BY_MAC:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/${mac}`,
    GET_MODULE_STATUS:(mac:string,ModuleId:number) => `/api/${API_VERSION}/${CONTROLLER}/status/${mac}/${ModuleId}`
} as const;