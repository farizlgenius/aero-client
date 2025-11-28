const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Module`;

export const ModuleEndpoint = {
    GET_MODULE:(location:number) => `/api/${API_VERSION}/${location}/${CONTROLLER}`,
    GET_MODULE_BY_ID : `/api/${API_VERSION}/${CONTROLLER}/`,
    GET_MODULE_BY_MAC : `/api/${API_VERSION}/${CONTROLLER}/`,
    GET_MODULE_STATUS : `/api/${API_VERSION}/${CONTROLLER}/status/`
} as const;