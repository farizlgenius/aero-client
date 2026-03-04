
const CONTROLLER = 'AccessLevel'


export const AccessLevelEndPoint = {
    GET: (location:number) => `/api/${location}/${CONTROLLER}`,
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    CREATE: `/api/${CONTROLLER}`,
    UPDATE : `/api/${CONTROLLER}`,
    DELETE_RANGE: `/api/${CONTROLLER}/delete/range`,
    DELETE:(ComponentId:number) => `/api/${CONTROLLER}/${ComponentId}`
} as const;

