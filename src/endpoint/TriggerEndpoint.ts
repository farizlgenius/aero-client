const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Trigger`;

export const TriggerEndpoint = {
    GET:(locationId:number) => `/api/${API_VERSION}/${locationId}/${CONTROLLER}`,
    COMMAND : `/api/${API_VERSION}/${CONTROLLER}/command`,
    SOURCE : `/api/${API_VERSION}/${CONTROLLER}/source`,
    TRAN:(source:number) => `/api/${API_VERSION}/${CONTROLLER}/tran/${source}`,
    CODE:(type:number) => `/api/${API_VERSION}/${CONTROLLER}/code/${type}`,
    DEVICE:(location:number,source:number) => `/api/${API_VERSION}/${location}/${CONTROLLER}/device/${source}`,
    CREATE:`/api/${API_VERSION}/${CONTROLLER}`,
    DELETE:(id:number) => `/api/${API_VERSION}/${CONTROLLER}/${id}`
} as const;