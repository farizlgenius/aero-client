
export enum ToastMessage{
    DELETE_SCP = "Delete Hardware",
    RESET_SCP = "Reset Hardware",
    UPLOAD_SCP = "Upload Hardware",
    GET_SCP_STATUS = "Get Hardware Status",
    GET_SCP_LIST = "Get Hardware List",
    GET_SCP_STRUCTURE = "Get Hardware Structure",
    CREATE_HARDWARE = "Create Hardware",
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
    DELETE_DOOR = "Delete Door",
    GET_INTERVAL = "Get Interval",
    CREATE_INTERVAL = "Create Interval",
    UPDATE_INTERVAL = "Update Interval",
    REMOVE_INTERVAL = "Remove Interval",
    API_ERROR = "Restful Api Exception no response",
    TOGGLE_OUTPUT = "Toggle Output",
    DELETE_CARDFORMAT = "Delete CardFormat",
    CREATE_CARD_FORMAT = "Create CardFormat",
    CREATE_ACCESS_LEVEL = "Create AccessGroup",
    DELETE_ACCESS_LEVEL = "Delete AccessGroup",
    DELETE_CARDHOLDER = "Delte Card Holder",
    CREATE_CARDHOLDER = "Create Card Holder",
    CREATE_AREA = "Create Area",
    CREATE_LOCATION = "Create Location",
    DELETE_LOCATION = "Delete Location",
    LOGIN = "Login",
    CREATE_MP_GROUP = "Create Monitor Group",
    DELETE_PROCEDURE = "Delete Procedure",
    POST_MONITOR_GROUP_COMMAND = "Monitor Group Command",
    CREATE_TRIGGER = "Create Trigger",
    GET_COMPONENT = "Hardware Component",
    DELETE_TRIGGER = "Delete Trigger",
    DELETE_MPG = "Delete Monitor Group"
}

export enum LicenseToast{
    CHECK = "Validate License"
}

export enum AuthToast {
    LOGIN = "Login"
}

export enum APIToast {
    API_ERROR = "Restful Api Exception no response"
}

export enum SettingToast {
    UPDATE_PASSWORD = "Update Password Rule"
}

export enum OperatorToast {
    CREATE = "Create Operator",
    UPDATE = "Update Operator",
    UPDATE_PASS = "Update Password",
    DELETE = "Delete Operator",
    DELETE_RANGE = "Delete Range Operator"
}

export enum HardwareToast {
    DELETE = "Delete Hardware",
    RESET = "Reset Hardware",
    UPLOAD = "Upload Hardware",
    STATUS = "Get Hardware Status",
    LIST = "Get Hardware List",
    STRUCTURE = "Get Hardware Structure",
    CREATE = "Create Hardware",
    COMPONENT = "Hardware Component",
    UPDATE = "Hardware Update",
    DELETE_RANGE = "Delete Hardwares",
    TOGGLE_TRAN = "Set Transaction"
}


export enum MonitorPointToast {
    CREATE = "Monitor Point Created",
    UPDATE = "Monitor Point Updated",
    DELETE = "Delete Monitor Point",
    MASK = "Masked Monitor Point",
    UNMASK = "Unmasked Monitor Point",
    DELETE_RANGE = "Delete Monitor Points"
    
}

export enum MonitorGroupToast 
{
    CREATE = "Create Monitor Group",
    DELETE = "Delete Monitor Group",
    DELETE_RANGE = "Delete Monitor Groups",
    UPDATE = "Update Monitor Group",
    COMMAND = "Monitor Group Command"
}

export enum DoorToast {
        GET_ACR = "Get Doors",
    GET_ACR_STATUS = "Get Door Status",
    CREATE_ACR = "Create Doors",
    DELETE_DOOR = "Delete Door",
}

export enum AccessLevelToast {
    CREATE_ACCESS_LEVEL = "Create Access Level",
    DELETE_ACCESS_LEVEL = "Delete Access Leve"
}


export enum CardToast {
    CREATE_CARDHOLDER = "Create Card Holder",
    DELETE_CARDHOLDER = "Delete Card Holder",
}

export enum CardFormatToast {
        CREATE = "Create CardFormat",
        UPDATE = "Update CardFormat",
    DELETE = "Delete CardFormat",
    DELETE_RANGE = "Delete CardFormats",
}


export enum LocationToast {
    CREATE = "Create Location",
    DELETE = "Delete Location",
    UPDATE = "Update Location",
    DELETE_RANGE = "Delete Range Location"
}

export enum AccessAreaToast {
    CREATE = "Create Area",
}


export enum HolidayToast {
    CREATE = "Create Holiday",
    UPDATE = "Update Holiday",
    DELETE = "Delete Holiday",
    DELETE_RANGE = "Delete Holidays"

}

export enum TimeZoneToast {
    CREATE = "Create Timezone",
    DELETE = "Delete Timezone",
    UPDATE = "Update Timezone",
    DELETE_RANGE = "Delete Timezones"
}

export enum IntervalToast {
    CREATE = "Create Interval",
    DELETE = "Delete Interval",
    UPDATE = "Update Interval",
    DELETE_RANGE = "Delete Intervals"
}


export enum RoleToast {
    CREATE = "Create Role",
    UPDATE = "Update Role",
    DELETE = "Delete Role",
    GET = "Get Role",
    DELETE_RANGE = "Delete Roles"
}

export enum ControlPointToast {
    CREATE = "Create Control Point",
    UPDATE = "Update Control Point",
    DELETE = "Delete Control Point",
    DELETE_RANGE = "Delete Control Points"
}