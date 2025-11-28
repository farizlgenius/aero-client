const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Door`;

export const DoorEndpoint = {
    GET_ACR_LIST : `/api/${API_VERSION}/${CONTROLLER}`,
    REMOVE_ACR : `/api/${API_VERSION}/${CONTROLLER}/`,
    POST_ACR_CHANGE_MODE : `/api/${API_VERSION}/${CONTROLLER}/mode`,
    POST_ACR_UNLOCK : `/api/${API_VERSION}/${CONTROLLER}/unlock/`,
    POST_ADD_ACR : `/api/${API_VERSION}/${CONTROLLER}`,
    GET_ACCESS_READER_MODE : `/api/${API_VERSION}/${CONTROLLER}/reader/mode`,
    GET_ACR_BY_MAC : `/api/${API_VERSION}/${CONTROLLER}/`,
    GET_ACR_STATUS : `/api/${API_VERSION}/${CONTROLLER}/status/`,
    GET_ACR_READER : `/api/${API_VERSION}/${CONTROLLER}/reader/`,
    GET_STRK_MODE : `/api/${API_VERSION}/${CONTROLLER}/strike/mode`,
    GET_ACR_MODE : `/api/${API_VERSION}/${CONTROLLER}/mode`,
    GET_APB_MODE : `/api/${API_VERSION}/${CONTROLLER}/apb/mode`,
    GET_BAUD_RATE : `/api/${API_VERSION}/${CONTROLLER}/osdp/baudrate`,
    GET_READER_OUT_CONFIG : `/api/${API_VERSION}/${CONTROLLER}/readerout/mode`,
    GET_SPARE_FLAG : `/api/${API_VERSION}/${CONTROLLER}/spareflag`,
    GET_ACCESS_CONTROL_FLAG : `/api/${API_VERSION}/${CONTROLLER}/accesscontrolflag`
} as const;
