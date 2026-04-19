const CONTROLLER = `identity/position`;

export const PositionEndpoint = {
    GET: `/api/${CONTROLLER}`,
    GET_BY_LOCATION:(location:number) => `/api/${location}/${CONTROLLER}`,
    CREATE: `/api/${CONTROLLER}`,
    PAGINATION: (pageNumber: number, pageSize: number, locationId?: number | undefined, search?: string | undefined, startDate?: string | undefined, endDate?: string | undefined) => `/api/${CONTROLLER}/pagination?${locationId == 0 || locationId == undefined ? "" : `DepartmentId=${locationId}`}&Page=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    UPDATE: `/api/${CONTROLLER}`,
    DELETE: (component: number) => `/api/${CONTROLLER}/${component}`,
    GET_RANGE: `/api/${CONTROLLER}/range`,
    DELETE_RANGE: `/api/${CONTROLLER}/delete/range`
} as const;
