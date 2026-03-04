const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Procedure`;

export const ProcedureEndpoint = {
    GET:(location:number) => `/api/${location}/${CONTROLLER}`,
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    CREATE:`/api/${CONTROLLER}`,
    UPDATE: `/api/${CONTROLLER}`,
    DELETE:(component:number) => `/api/${CONTROLLER}/${component}`,
    DLETE_RANGE :`/api/${CONTROLLER}`,
    ACTION_TYPE : `/api/${CONTROLLER}/type`
} as const;