const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Role`;

export const RoleEndpoint = {
    GET:`/api/${API_VERSION}/${CONTROLLER}`,
    CREATE:`/api/${API_VERSION}/${CONTROLLER}`,
    DELETE :(component:number) => `/api/${API_VERSION}/${CONTROLLER}/${component}`,
    UPDATE :`/api/${API_VERSION}/${CONTROLLER}/`,
    GET_FEATURE_LIST :`/api/${API_VERSION}/Feature/list`,
    DELETE_RANGE:`/api/${API_VERSION}/${CONTROLLER}/delete/range`
} as const;