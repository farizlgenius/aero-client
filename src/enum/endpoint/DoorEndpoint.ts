export enum DoorEndpoint {
    GET_ACR_LIST = '/api/v1/Door',
    REMOVE_ACR = '/api/v1/Door/',
    POST_ACR_CHANGE_MODE = '/api/v1/Door/mode',
    POST_ACR_UNLOCK = '/api/v1/Door/unlock/',
    POST_ADD_ACR = '/api/v1/Door',
    GET_ACCESS_READER_MODE = '/api/v1/Door/reader/mode',
    GET_ACR_BY_MAC = '/api/v1/Door/',
    GET_ACR_STATUS = '/api/v1/Door/status/',
    GET_ACR_READER = "/api/v1/Door/reader/",
    GET_STRK_MODE = "/api/v1/Door/strike/mode",
    GET_ACR_MODE = "/api/v1/Door/mode",
    GET_APB_MODE = "/api/v1/Door/apb/mode",
    GET_BAUD_RATE = "/api/v1/Door/osdp/baudrate",
    GET_READER_OUT_CONFIG = "/api/v1/Door/readerout/mode",
    GET_SPARE_FLAG = "/api/v1/Door/spareflag",
    GET_ACCESS_CONTROL_FLAG = "/api/v1/Door/accesscontrolflag"
}
