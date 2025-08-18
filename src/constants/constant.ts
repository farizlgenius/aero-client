export enum SCPEndPoint {
    GET_IDREPORT_LIST = '/api/v1/scp/report/all',
    GET_SCP_LIST = '/api/v1/scp/all',
    POST_RESET_SCP = '/api/v1/scp/reset',
    POST_SCP_STATUS = '/api/v1/scp/status',
    POST_REMOVE_SCP = '/api/v1/scp/remove'
}

export enum HubEndPoint {
    CMND_HUB = "/cmndHub",
    SCP_HUB = '/scpHub',
}

export const ModalDetail = {
    REMOVE_HARDWARE: { header:"Remove Hardware",body:"Please click confirm for remove hardware" },
} as const;

export type ModalDetail = typeof ModalDetail[keyof typeof ModalDetail];

// Hardware Page
export const ID_REPORT_KEY = [  "deviceID",'macAddress','scpID','ip'];
export const ID_REPORT_TABLE_HEADER = ["Model", "Mac address", "Id", "Ip address", "Action"];
export const HARDWARE_TABLE_HEADER = [ "Name", "Model", "Mac address", "Ip address", "Status", "Action"];
export const HARDWARE_TABLE_KEY = ["name", "model", "mac", "ipAddress"];