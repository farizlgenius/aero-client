


// Ip Address
const PORT = import.meta.env.PORT || 5031;
const SERVER = import.meta.env.VITE_SERVER_IP || `${location.protocol}//${location.hostname}:${PORT}`;






// SCP
export const GET_IDREPORT_LIST = SERVER + '/api/v1/IdReport';
export const GET_SCP_LIST = SERVER + '/api/v1/Hardware';
export const POST_RESET_SCP = SERVER + '/api/v1/Hardware/reset';
export const GET_SCP_STATUS = SERVER + '/api/v1/Hardware/status/';
export const POST_REMOVE_SCP = SERVER + '/api/v1/Hardware/';
export const POST_ADD_SCP = SERVER + '/api/v1/Hardware';
export const POST_UPCONFIG_SCP = SERVER + '/api/v1/Hardware/upload';

export enum IdReportEndPoint {
    
}




// CP



// MP


// ACR


// HOLIDAY

// Interval




// SIO





export enum HubEndPoint {
    CMND_HUB = "/cmndHub",
    AERO_HUB = '/aeroHub',
    CREDENTIAL_HUB = '/credentialHub'
}







export const ModalDetail = {
    REMOVE_HARDWARE: { header:"Remove Hardware",body:"Please click confirm for remove hardware" },
} as const;

export type ModalDetail = typeof ModalDetail[keyof typeof ModalDetail];

















