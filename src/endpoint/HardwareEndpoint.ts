const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Hardware`;

export const HardwareEndpoint = {
    GET:(locationId:number) => `/api/${locationId}/${CONTROLLER}`,
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    TYPE: `/api/${CONTROLLER}/type`,
    DELETE:(mac:string) => `/api/${CONTROLLER}/${mac}`,
    DELETE_RANGE: `/api/${CONTROLLER}/range`,
    STATUS:(mac:string) => `/api/${CONTROLLER}/status/${mac}`,
    RESET:(mac:string) => `/api/${CONTROLLER}/reset/${mac}`,
    UPLOAD:(mac:string) => `/api/${CONTROLLER}/upload/${mac}`,
    CREATE : `/api/${CONTROLLER}`,
    UPDATE : `/api/${CONTROLLER}`,
    VERIFY_MEM:(mac:string) => `/api/${CONTROLLER}/verify/mem/${mac}`,
    VERIFY_COM:(mac:string) => `/api/${CONTROLLER}/verify/com/${mac}`,
    TRAN:(mac:string) => `/api/${CONTROLLER}/tran/${mac}`,
    ID_REPORT: (location:number) => `/api/${location}/IdReport`,
    SET_TRAN : (mac:string,param:number) => `/api/${CONTROLLER}/tran/${mac}/${param}`,
    TRAN_RANGE: `/api/${CONTROLLER}/tran/range`
} as const

