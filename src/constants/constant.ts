


// Ip Address
const SERVER = import.meta.env.VITE_SERVER_IP;







// SCP
export const GET_IDREPORT_LIST = SERVER + '/api/v1/IdReport';
export const GET_SCP_LIST = SERVER + '/api/v1/Hardware';
export const POST_RESET_SCP = SERVER + '/api/v1/Hardware/reset';
export const GET_SCP_STATUS = SERVER + '/api/v1/Hardware/status/';
export const POST_REMOVE_SCP = SERVER + '/api/v1/Hardware/';
export const POST_ADD_SCP = SERVER + '/api/v1/Hardware';
export const POST_UPCONFIG_SCP = SERVER + '/api/v1/Hardware/upload';

export enum IdReportEndPoint {
    GET_ID_REPORT_LIST = "/api/v1/IdReport"
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


export enum AreaEndPoint {
    GET_AREA = "/api/v1/AccessArea",
    CREATE_AREA = "/api/v1/AccessArea",
    DELETE_AREA = "/api/v1/AccessArea/",
    GET_ACCESS_CONTROL = "/api/v1/AccessArea/access",
    GET_OCC_CONTROL = "/api/v1/AccessArea/occcontrol",
    GET_ARE_FLAG = "/api/v1/AccessArea/areaflag",
    GET_MULTI_OCC = "/api/v1/AccessArea/multiocc"
}




export const ModalDetail = {
    REMOVE_HARDWARE: { header:"Remove Hardware",body:"Please click confirm for remove hardware" },
} as const;

export type ModalDetail = typeof ModalDetail[keyof typeof ModalDetail];

// Hardware Page
export const ID_REPORT_KEY = [ "deviceId",'macAddress','scpId','ip'];
export const ID_REPORT_TABLE_HEADER = ["Model", "Mac address", "Id", "Ip address", "Action"];















