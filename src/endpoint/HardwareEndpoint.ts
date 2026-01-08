const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Hardware`;

export const HardwareEndpoint = {
    GET:(locationId:number) => `/api/${API_VERSION}/${locationId}/${CONTROLLER}`,
    TYPE: `/api/${API_VERSION}/${CONTROLLER}/type`,
    DELETE:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/${mac}`,
    DELETE_RANGE: `/api/${API_VERSION}/${CONTROLLER}/range`,
    STATUS:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/status/${mac}`,
    RESET:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/reset/${mac}`,
    UPLOAD:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/upload/${mac}`,
    CREATE : `/api/${API_VERSION}/${CONTROLLER}`,
    UPDATE : `/api/${API_VERSION}/${CONTROLLER}`,
    VERIFY_MEM:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/verify/mem/${mac}`,
    VERIFY_COM:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/verify/com/${mac}`,
    TRAN:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/tran/${mac}`,
    ID_REPORT: `/api/${API_VERSION}/IdReport`,
    SET_TRAN : (mac:string,param:number) => `/api/${API_VERSION}/${CONTROLLER}/tran/${mac}/${param}`,
    TRAN_RANGE: `/api/${API_VERSION}/${CONTROLLER}/tran/range`
} as const

