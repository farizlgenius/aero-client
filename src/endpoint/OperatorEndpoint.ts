const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Operator`;

export const OperatorEndpoint = {
    GET:(locationId:number) => `/api/${locationId}/${CONTROLLER}`, 
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    CREATE:`/api/${CONTROLLER}`,
    DELETE:(component:number) => `/api/${CONTROLLER}/${component}`,
    UPDATE:`/api/${CONTROLLER}`,
    GET_ID:(component:number) => `/api/${CONTROLLER}/${component}`,
    PASS: `/api/${CONTROLLER}/password/update`,
    DELETE_RANGE: `/api/${CONTROLLER}/delete/range`
} as const;