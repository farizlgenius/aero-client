const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Door`;

export const DoorEndpoint = {
    GET:(location:number) => `/api/${location}/${CONTROLLER}`,
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    DELETE:(component:number) => `/api/${CONTROLLER}/${component}`,
    DELETE_RANGE: `/api/${CONTROLLER}`,
    UPDATE: `/api/${CONTROLLER}`,
    POST_ACR_CHANGE_MODE : `/api/${CONTROLLER}/mode`,
    POST_ACR_UNLOCK:(mac:string,acrNo:number) => `/api/${CONTROLLER}/unlock/${mac}/${acrNo}`,
    CREATE : `/api/${CONTROLLER}`,
    GET_ACCESS_READER_MODE : `/api/${CONTROLLER}/reader/mode`,
    GET_ACR_BY_MAC :(mac:string)=> `/api/${CONTROLLER}/${mac}`,
    GET_ACR_STATUS:(mac:string,acrNo:number) => `/api/${CONTROLLER}/status/${mac}/${acrNo}`,
    GET_ACR_READER :(mac:string,module:number) => `/api/${CONTROLLER}/reader/${mac}/${module}`,
    GET_STRK_MODE : `/api/${CONTROLLER}/strike/mode`,
    GET_ACR_MODE : `/api/${CONTROLLER}/mode`,
    GET_APB_MODE : `/api/${CONTROLLER}/apb/mode`,
    GET_BAUD_RATE : `/api/${CONTROLLER}/osdp/baudrate`,
    GET_READER_OUT_CONFIG : `/api/${CONTROLLER}/readerout/mode`,
    GET_SPARE_FLAG : `/api/${CONTROLLER}/spareflag`,
    GET_ACCESS_CONTROL_FLAG : `/api/${CONTROLLER}/accesscontrolflag`
} as const;
