const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Hardware`;

export const HardwareEndpoint = {
    GET:(locationId:number) => `/api/${API_VERSION}/${locationId}/${CONTROLLER}`,
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api/${API_VERSION}${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    TYPE: `/api/${API_VERSION}/${CONTROLLER}/type`,
    DELETE:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/${mac}`,
    DELETE_RANGE: `/api/${API_VERSION}/${CONTROLLER}/range`,
    STATUS:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/status/${mac}`,
    RESET:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/reset/${mac}`,
    UPLOAD:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/upload/${mac}`,
    CREATE : `/api/${API_VERSION}/${CONTROLLER}`,
    UPDATE : `/api/${API_VERSION}/${CONTROLLER}`,
    VERIFY_MEM:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/verify/mem/${mac}`,
    VERIFY_COM:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/verify/com/${mac}`,
    TRAN:(mac:string) => `/api/${API_VERSION}/${CONTROLLER}/tran/${mac}`,
    ID_REPORT: (location:number) => `/api/${API_VERSION}/${location}/IdReport`,
    SET_TRAN : (mac:string,param:number) => `/api/${API_VERSION}/${CONTROLLER}/tran/${mac}/${param}`,
    TRAN_RANGE: `/api/${API_VERSION}/${CONTROLLER}/tran/range`
} as const

