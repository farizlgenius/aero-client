const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `MonitorPoint`;

export const MonitorPointEndpoint = {
    MPS:(locationId:number)=> `/api/${API_VERSION}/${locationId}/${CONTROLLER}`,
    MP_BY_MAC:(mac:string) =>  `/api/${API_VERSION}/${CONTROLLER}/${mac}`,
    CREATE : `/api/${API_VERSION}/${CONTROLLER}`,
    UPDATE:  `/api/${API_VERSION}/${CONTROLLER}`,
    GET_MP_STATUS : `/api/${API_VERSION}/${CONTROLLER}/status/`,
    DELETE :(component:number) => `/api/${API_VERSION}/${CONTROLLER}/${component}`,
    DELETE_RANGE: `/api/${API_VERSION}/${CONTROLLER}/delete/range`,
    IP_LIST :(mac:string,component:number) => `/api/${API_VERSION}/${CONTROLLER}/ip/${mac}/${component}`,
    MASK : `/api/${API_VERSION}/${CONTROLLER}/mask`,
    UNMASK : `/api/${API_VERSION}/${CONTROLLER}/unmask`,
    IP_MODE : `/api/${API_VERSION}/${CONTROLLER}/input/mode`,
    MP_MODE : `/api/${API_VERSION}/${CONTROLLER}/mode`,
    LOG_FUNCTION : `/api/${API_VERSION}/${CONTROLLER}/lf`
} as const;