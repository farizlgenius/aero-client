const CONTROLLER = `identity/department`;

export const DepartmentEndpoint = {
    GET: `/api/${CONTROLLER}`,
    GET_BY_COMPANY:(company:number) => `/api/${CONTROLLER}/company/${company}`,
    CREATE: `/api/${CONTROLLER}`,
    PAGINATION: (pageNumber: number, pageSize: number, locationId?: number | undefined, search?: string | undefined, startDate?: string | undefined, endDate?: string | undefined) => `/api/${CONTROLLER}/pagination?${locationId == 0 || locationId == undefined ? "" : `CompanyId=${locationId}`}&Page=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&Search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    UPDATE: `/api/${CONTROLLER}`,
    DELETE: (component: number) => `/api/${CONTROLLER}/${component}`,
    GET_RANGE: `/api/${CONTROLLER}/range`,
    DELETE_RANGE: `/api/${CONTROLLER}/delete/range`
} as const;
