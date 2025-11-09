export enum ControlPointEndpoint {
    GET_CP_LIST = '/api/v1/ControlPoint',
    DELETE_CP = '/api/v1/ControlPoint/',
    POST_CP_TRIGGER = '/api/v1/ControlPoint/trigger',
    POST_ADD_CP = '/api/v1/ControlPoint/control',
    GET_CP_STATUS = '/api/v1/ControlPoint/status/',
    GET_CP_OUTPUT = '/api/v1/ControlPoint/op/',
    GET_OFFLINE_OP_MODE = '/api/v1/ControlPoint/mode/offline',
    GET_RELAY_OP_MODE = '/api/v1/ControlPoint/mode/relay'
}