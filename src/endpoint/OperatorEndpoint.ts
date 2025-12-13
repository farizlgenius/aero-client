const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Operator`;

export const OpearatorEndpoint = {
    GET_OPER:(location:string) => `/api/${API_VERSION}/${location}/${CONTROLLER}`,
    CREATE_OPER:`/api/${API_VERSION}/${CONTROLLER}`,
    DELETE_OPER:`/api/${API_VERSION}/${CONTROLLER}/`,
    UPDATE_OPER:`/api/${API_VERSION}/${CONTROLLER}/`,
    GET_OPER_BY_ID:`/api/${API_VERSION}/${CONTROLLER}/`
} as const;