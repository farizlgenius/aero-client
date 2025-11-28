const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `ControlPoint`;

export const ControlPointEndpoint = {
    GET_CP:(location:number) => `/api/${API_VERSION}/${location}/${CONTROLLER}`,
    DELETE_CP : `/api/${API_VERSION}/${CONTROLLER}/`,
    CP_TRIGGER : `/api/${API_VERSION}/${CONTROLLER}/trigger`,
    CREATE_CP : `/api/${API_VERSION}/${CONTROLLER}/control`,
    GET_CP_STATUS : `/api/${API_VERSION}/${CONTROLLER}/status/`,
    GET_CP_OUTPUT : `/api/${API_VERSION}/${CONTROLLER}/op/`,
    GET_OFFLINE_OP_MODE : `/api/${API_VERSION}/${CONTROLLER}/mode/offline`,
    GET_RELAY_OP_MODE : `/api/${API_VERSION}/${CONTROLLER}/mode/relay`
} as const;

