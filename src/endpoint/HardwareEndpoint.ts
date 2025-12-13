const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Hardware`;

export const HardwareEndpoint = {
    GET:(locationId:number) => `/api/${API_VERSION}/${locationId}/${CONTROLLER}`,
    DELETE:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/${mac}`,
    STATUS:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/status/${mac}`,
    RESET:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/reset/${mac}`,
    UPLOAD:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/upload/${mac}`,
    CREATE : `/api/${API_VERSION}/${CONTROLLER}`,
    VERIFY_MEM:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/verify/mem/${mac}`,
    VERIFY_COM:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/verify/com/${mac}`,
} as const
