const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Door`;

export const DoorEndpoint = {
    GET:(location:number) => `/api/${API_VERSION}/${location}/${CONTROLLER}`,
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api/${API_VERSION}${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    DELETE:(component:number) => `/api/${API_VERSION}/${CONTROLLER}/${component}`,
    DELETE_RANGE: `/api/${API_VERSION}/${CONTROLLER}`,
    UPDATE: `/api/${API_VERSION}/${CONTROLLER}`,
    POST_ACR_CHANGE_MODE : `/api/${API_VERSION}/${CONTROLLER}/mode`,
    POST_ACR_UNLOCK:(mac:string,acrNo:number) => `/api/${API_VERSION}/${CONTROLLER}/unlock/${mac}/${acrNo}`,
    CREATE : `/api/${API_VERSION}/${CONTROLLER}`,
    GET_ACCESS_READER_MODE : `/api/${API_VERSION}/${CONTROLLER}/reader/mode`,
    GET_ACR_BY_MAC :(mac:string)=> `/api/${API_VERSION}/${CONTROLLER}/${mac}`,
    GET_ACR_STATUS:(mac:string,acrNo:number) => `/api/${API_VERSION}/${CONTROLLER}/status/${mac}/${acrNo}`,
    GET_ACR_READER :(mac:string,module:number) => `/api/${API_VERSION}/${CONTROLLER}/reader/${mac}/${module}`,
    GET_STRK_MODE : `/api/${API_VERSION}/${CONTROLLER}/strike/mode`,
    GET_ACR_MODE : `/api/${API_VERSION}/${CONTROLLER}/mode`,
    GET_APB_MODE : `/api/${API_VERSION}/${CONTROLLER}/apb/mode`,
    GET_BAUD_RATE : `/api/${API_VERSION}/${CONTROLLER}/osdp/baudrate`,
    GET_READER_OUT_CONFIG : `/api/${API_VERSION}/${CONTROLLER}/readerout/mode`,
    GET_SPARE_FLAG : `/api/${API_VERSION}/${CONTROLLER}/spareflag`,
    GET_ACCESS_CONTROL_FLAG : `/api/${API_VERSION}/${CONTROLLER}/accesscontrolflag`
} as const;
