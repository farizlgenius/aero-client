const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = 'CardHolder'

// CREDENTIAL
export const CardHolderEndpoint = {
    GET:(locationId:number)=> `/api/${API_VERSION}/${locationId}/${CONTROLLER}`,
    DELETE:(UserId:string)=> `/api/${API_VERSION}/${CONTROLLER}/${UserId}`,
    UPDATE:`/api/${API_VERSION}/${CONTROLLER}`, 
    CREATE:`/api/${API_VERSION}/${CONTROLLER}`,
    SCAN:`/api/${API_VERSION}/${CONTROLLER}/scan`,
    DELETE_RANGE: `/api/${API_VERSION}/${CONTROLLER}/delete/range`
} as const
