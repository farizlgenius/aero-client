const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = 'CardHolder'

// CREDENTIAL
export const CardHolderEndpoint = {
    GET_CARDHOLDERS:(locationId:number)=> `/api/${API_VERSION}/${locationId}/${CONTROLLER}`,
    DELETE_CARDHOLDER: `/api/${API_VERSION}/${CONTROLLER}/`,
    CREATE_CARDHOLDER:`/api/${API_VERSION}/${CONTROLLER}`,
    SCAN_CARD:`/api/${API_VERSION}/${CONTROLLER}/scan`
} as const
