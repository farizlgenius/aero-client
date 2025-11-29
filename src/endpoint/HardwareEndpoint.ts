const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Hardware`;

export const HardwareEndpoint = {
    GET_SCP_LIST:(locationId:number) => `/api/${API_VERSION}/${locationId}/${CONTROLLER}`,
    DELETE_SCP:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/${mac}`,
    GET_SCP_STATUS:(mac:string,id:number) => `/api/${API_VERSION}/${CONTROLLER}/status/${mac}/${id}`,
    POST_SCP_RESET:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/reset/${mac}`,
    POST_SCP_UPLOAD:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/upload/${mac}`,
    POST_ADD_SCP : `/api/${API_VERSION}/${CONTROLLER}`
} as const
