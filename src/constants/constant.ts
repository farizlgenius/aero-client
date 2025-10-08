// Ip Address
const SERVER = import.meta.env.VITE_SERVER_IP;

// Table Type Constant
export enum TableContent {
    DOOR = 0,
    INTERVAL = 10,
}

// Popup Message
export enum PopUpMsg{
    DELETE_SCP = "Delete Hardware",
    RESET_SCP = "Reset Hardware",
    UPLOAD_SCP = "Upload Hardware",
    GET_SCP_STATUS = "Get Hardware Status",
    GET_SCP_LIST = "Get Hardware List",
    POST_ADD_SCP = "Create Hardware",
    GET_ID_REPORT_LIST = "Get Id Report List",
    CREATE_CP = "Control Point Created",
    GET_CP_STATUS = "Retrive Control Point Status",
    DELETE_CP = "Delete Control Point",
    TRIGGER_CP = "Trigger Control Point",
    CREATE_MP = "Monitor Point Created",
    DELETE_MP = "Delete Monitor Point",
    MASK_MP = "Masked Monitor Point",
    UNMASK_MP = "Unmasked Monitor Point",
    GET_MODULE_STATUS = "Get Module Status",
    GET_MODULE_LIST = "Get Module",
    DELETE_HOL = "Delete Holiday",
    GET_HOL = "Get Holiday",
    CREATE_HOL = "Create Holiday",
    UPDATE_HOL = "Update Holiday",
    GET_TZ = "Get TimeZone",
    DELETE_TZ = "Delete TimeZone",
    CREATE_TZ = "Create TimeZone",
    GET_TZ_MODE = "Get TimeZone Mode",
    GET_ACR = "Get Doors",
    GET_ACR_STATUS = "Get Door Status",
    CREATE_ACR = "Create Doors",
    GET_INTERVAL = "Get Interval",
    CREATE_INTERVAL = "Create Interval",
    UPDATE_INTERVAL = "Update Interval",
    DELETE_INTERVAL = "Delete Interval",
    API_ERROR = "Restful Api Exception no response",
}

// Http
export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT"
}

// HttpCode
export enum HttpCode {
    CREATED = 201,
    OK = 200,
    BAD_REQUEST = 400,
    INTERNAL_ERROR = 500
}

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

export enum ScpEndPoint {
    GET_SCP_LIST = '/api/v1/Hardware',
    DELETE_SCP = "/api/v1/Hardware/",
    GET_SCP_STATUS = "/api/v1/Hardware/status/",
    POST_SCP_RESET = "/api/v1/Hardware/reset/",
    POST_SCP_UPLOAD = "/api/v1/Hardware/upload/",
    POST_ADD_SCP = "/api/v1/Hardware"
}

// Time Zone
export enum TimeZoneEndPoint {
    GET_TZ_LIST = "/api/v1/TimeZone",
    GET_TZ_BY_ID = "/api/v1/TimeZone/",
    DELETE_TZ = "/api/v1/TimeZone/",
    POST_ADD_TZ = "/api/v1/TimeZone",
    GET_MODE_TZ = "/api/v1/TimeZone/mode"
}

// CP

export enum CPEndPoint {
    GET_CP_LIST = '/api/v1/ControlPoint',
    DELETE_CP = '/api/v1/ControlPoint/',
    POST_CP_TRIGGER = '/api/v1/ControlPoint/trigger',
    POST_ADD_CP = '/api/v1/ControlPoint',
    GET_CP_STATUS = '/api/v1/ControlPoint/status/',
    GET_CP_OUTPUT = '/api/v1/ControlPoint/op/',
    GET_OFFLINE_OP_MODE = '/api/v1/ControlPoint/mode/offline',
    GET_RELAY_OP_MODE = '/api/v1/ControlPoint/mode/relay'
}

// MP
export enum MPEndPoint {
    GET_MP_LIST = '/api/v1/MonitorPoint',
    POST_ADD_MP = '/api/v1/MonitorPoint',
    GET_MP_STATUS = '/api/v1/MonitorPoint/status/',
    DELETE_MP = '/api/v1/MonitorPoint/',
    GET_IP_LIST = "/api/v1/MonitorPoint/ip/",
    POST_MASK = "/api/v1/MonitorPoint/mask",
    POST_UNMASK = "/api/v1/MonitorPoint/unmask",
    GET_IP_MODE = "/api/v1/MonitorPoint/mode"
}

// ACR
export enum ACREndPoint {
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
    GET_APB_MODE = "/api/v1/Door/apb/mode"
}


// HOLIDAY
export enum HolidayEndPoint {
    GET_HOL_LIST = "/api/v1/Holiday",
    DELETE_HOL = "/api/v1/Holiday/",
    POST_HOL = "/api/v1/Holiday",
    PUT_HOL = "/api/v1/Holiday"
}

// Interval
export enum IntervalEndPoint {
    GET_INTERVAL = "/api/v1/Interval" ,
    POST_ADD_INTERVAL = "/api/v1/Interval",
    DELETE_INTERVAL = "/api/v1/Interval/",
    PUT_UPDATE_INTERVAL = "/api/v1/Interval"
}


// CREDENTIAL
export enum CredentialEndPoin{
    GET_CREDENTIAL_LIST = "/api/v1/Credential/all",
    POST_REMOVE_CREDENTIAL = "/api/v1/Credential/remove/",
    POST_ADD_CREDENTIAL = '/api/v1/Credential/add',
    POST_TRIGGER_SCAN_CARD = '/api/v1/Credential/scan'
}

// SIO
export enum SioEndPoint {
    GET_SIO_LIST = '/api/v1/Module',
    GET_SIO_BY_ID = '/api/v1/Module/',
    GET_SIO_BY_MAC = '/api/v1/Module/',
    GET_SIO_STATUS = "/api/v1/Module/status/"
}


export const GET_ACCESS_LEVEL_LIST = SERVER +'/api/v1/AccessLevel/all';
export const POST_ADD_ACCESS_LEVEL = SERVER + '/api/v1/AccessLevel/add';

export enum HubEndPoint {
    CMND_HUB = "/cmndHub",
    AERO_HUB = '/aeroHub',
    CREDENTIAL_HUB = '/credentialHub'
}

export enum CardFormatEndPoint {
    GET_ALL_CARDFORMAT = '/api/v1/CardFormat/all',
    POST_ADD_CARDFORMAT = '/api/v1/CardFormat/add',
    DELETE_CARDFORMAT = '/api/v1/CardFormat/remove/'
}


export enum Sex {
    F='Female',
    M='Male'
}

export const ModalDetail = {
    REMOVE_HARDWARE: { header:"Remove Hardware",body:"Please click confirm for remove hardware" },
} as const;

export type ModalDetail = typeof ModalDetail[keyof typeof ModalDetail];

// Hardware Page
export const ID_REPORT_KEY = [  "deviceID",'macAddress','scpID','ip'];
export const ID_REPORT_TABLE_HEADER = ["Model", "Mac address", "Id", "Ip address", "Action"];
export const HARDWARE_TABLE_HEADER = [ "Name", "Model", "Mac address", "Ip address", "Status", "Action"];
export const HARDWARE_TABLE_KEY = ["name", "model", "mac", "ip"];

// CP Page
export const CP_TABLE_HEADER: string[] = ["Name", "Main Controller" ,"Module",  "Mode", "Status", "Action"]
export const CP_KEY: string[] = ["name","mac" ,"sioName", "mode"];

// MP Page
export const MP_TABLE_HEADER:string[] = [ "Name", "Main Controller", "Module" ,"Mode","Masked", "Status", "Action"]
export const MP_KEY:string[] = ["name", "mac", "sioName","mode","isMask"];

// ACR Page
export const ACR_TABLE_HEADER: string[] = ["Name", "Module", "Mode", "Status", "Action"]
export const ACR_KEY: string[] = ["name", "rdrSioName",];

// Credential Page
export const CREDENTIAL_TABLE_HEAD: string[] = ["Id","Title" ,"First Name","Middle Name","Last Name", "Status", "Action"];
export const  CREDENTIAL_KEY: string[] = ["cardHolderId","title", "firstName","middleName","lastName","holderStatus"]; 

// TimeZone Page
export const TIMEZONE_TABLE_HEAD:string[] = ["Name", "Active Date","Deactive Date", "Action"]
export const TIMEZONE_KEY: string[] = ["name", "activeTime","deactiveTime"];

// Interval Page
export const INTERVAL_TABLE_HEAD:string[] = ["Start Time","End Time","Days","Action"]
export const INTERVAL_KEY:string[] = ["startTime","endTime","days"];

// Holiday Page 
export const Hol_TABLE_HEAD:string[] = ["Day", "Month","Year", "Action"]
export const Hol_KEY: string[] = ["day", "month","year"];

// Card Format Page
export const CARDFORMAT_TABLE_HEAD:string[] = [
    "Name","Bits","Facility" ,"Action"
]
export const CARDFORMAT_KEY:string[] = [
    "cardFormatName","bits","facility", 
];

// Access Group Page 
export const ACCESSGROUP_TABLE_HEAD: string[] = [
    "Name", "Access Level Number","Action"
]

export const ACCESSGROUP_KEY: string[] = [
    "name", "elementNo"
];

// Sio Page
// Define Table Header
export const SIO_TABLE_HEADER: string[] = [
  "Hardware", "Address", "Model", "Tamper", "AC", "Battery", "Status", "Action"
]

// Define Keys
export const SIO_KEY: string[] = [
  "name", "address", "model", 
]


