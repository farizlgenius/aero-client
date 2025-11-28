const API_VERSION = import.meta.env.VITE_API_VERSION;

export const OpearatorEndpoint = {
    GET_OPER:(location:string) => `/api/${API_VERSION}/${location}/Operator`,
    CREATE_OPER:`/api/${API_VERSION}/Operator`,
    DELETE_OPER:`/api/${API_VERSION}/Operator/`,
    UPDATE_OPER:`/api/${API_VERSION}/Operator/`,
    GET_OPER_BY_ID:`/api/${API_VERSION}/Operator/`
} as const;