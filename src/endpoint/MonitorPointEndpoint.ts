const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `MonitorPoint`;

export const MonitorPointEndpoint = {
    GET_MP_LIST:(locationId:number)=> `/api/${API_VERSION}/${locationId}/${CONTROLLER}`,
    POST_ADD_MP : `/api/${API_VERSION}/${CONTROLLER}`,
    GET_MP_STATUS : `/api/${API_VERSION}/${CONTROLLER}/status/`,
    DELETE_MP : `/api/${API_VERSION}/${CONTROLLER}/`,
    GET_IP_LIST : `/api/${API_VERSION}/${CONTROLLER}/ip/`,
    POST_MASK : `/api/${API_VERSION}/${CONTROLLER}/mask`,
    POST_UNMASK : `/api/${API_VERSION}/${CONTROLLER}/unmask`,
    GET_IP_MODE : `/api/${API_VERSION}/${CONTROLLER}/input/mode`,
    GET_MP_MODE : `/api/${API_VERSION}/${CONTROLLER}/mode`
} as const;