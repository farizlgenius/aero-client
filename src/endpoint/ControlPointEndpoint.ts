const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `ControlPoint`;

export const ControlPointEndpoint = {
    GET:(location:number) => `/api/${API_VERSION}/${location}/${CONTROLLER}`,
    DELETE :(component:number) => `/api/${API_VERSION}/${CONTROLLER}/${component}`,
    TRIGGER : `/api/${API_VERSION}/${CONTROLLER}/trigger`,
    CREATE : `/api/${API_VERSION}/${CONTROLLER}/control`,
    UPDATE : `/api/${API_VERSION}/${CONTROLLER}`,
    STATUS : `/api/${API_VERSION}/${CONTROLLER}/status/`,
    OUTPUT : (mac:string,component:number) => `/api/${API_VERSION}/${CONTROLLER}/op/${mac}/${component}`,
    GET_OFFLINE_OP_MODE : `/api/${API_VERSION}/${CONTROLLER}/mode/offline`,
    GET_RELAY_OP_MODE : `/api/${API_VERSION}/${CONTROLLER}/mode/relay`,
    DELETE_RANGE: `/api/${API_VERSION}/${CONTROLLER}/delete/range`
} as const;

