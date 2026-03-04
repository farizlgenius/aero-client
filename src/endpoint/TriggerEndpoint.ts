const CONTROLLER = `Trigger`;

export const TriggerEndpoint = {
    GET:(locationId:number) => `/api/${locationId}/${CONTROLLER}`,
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    COMMAND : `/api/${CONTROLLER}/command`,
    SOURCE : `/api/${CONTROLLER}/source`,
    TRAN:(source:number) => `/api/${CONTROLLER}/tran/${source}`,
    CODE:(type:number) => `/api/${CONTROLLER}/code/${type}`,
    DEVICE:(location:number,source:number) => `/api/${location}/${CONTROLLER}/device/${source}`,
    CREATE:`/api/${CONTROLLER}`,
    DELETE:(id:number) => `/api/${CONTROLLER}/${id}`,
    DELETE_RANGE: `/api/${CONTROLLER}`,
    UPDATE:`/api/${CONTROLLER}`,
} as const;