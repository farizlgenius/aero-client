const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Procedure`;

export const ProcedureEndpoint = {
    GET:(location:number) => `/api/${API_VERSION}/${location}/${CONTROLLER}`,
    CREATE: `/api/${API_VERSION}/${CONTROLLER}`,
    DELETE: `/api/${API_VERSION}/${CONTROLLER}`,
    ACTION_TYPE : `/api/${API_VERSION}/${CONTROLLER}/type`
} as const;