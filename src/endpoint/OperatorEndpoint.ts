const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Operator`;

export const OperatorEndpoint = {
    GET:(location:string) => `/api/${API_VERSION}/${location}/${CONTROLLER}`,
    CREATE:`/api/${API_VERSION}/${CONTROLLER}`,
    DELETE:(component:number) => `/api/${API_VERSION}/${CONTROLLER}/${component}`,
    UPDATE:`/api/${API_VERSION}/${CONTROLLER}`,
    GET_ID:(component:number) => `/api/${API_VERSION}/${CONTROLLER}/${component}`,
    PASS: `/api/${API_VERSION}/${CONTROLLER}/password/update`,
    DELETE_RANGE: `/api/${API_VERSION}/${CONTROLLER}/delete/range`
} as const;