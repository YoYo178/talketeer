export type HTTP_METHODS = 'GET' | 'PATCH' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS';

type AUTH_ROUTES = 'LOGIN' | 'LOGOUT' | 'SIGNUP' | 'CHECK_EMAIL';
type FRIEND_ROUTES = 'SEND_FRIEND_REQUEST' | 'ACCEPT_FRIEND_REQUEST';
type ROOM_ROUTES = 'GET_ALL_ROOMS' | 'CREATE_ROOM' | 'GET_ROOM_BY_ID' | 'JOIN_ROOM' | 'LEAVE_ROOM' | 'KICK_USER_FROM_ROOM' | 'BAN_USER_FROM_ROOM';
type USER_ROUTES = 'GET_ME' | 'GET_USER';

type API_ROUTES = AUTH_ROUTES | FRIEND_ROUTES | ROOM_ROUTES | USER_ROUTES;

export type Endpoint = {
    URL: string;
    METHOD: HTTP_METHODS;
}

export type Endpoints = {
    [key in API_ROUTES]: Endpoint
}

export interface APIResponse<T = {}> {
    success: boolean,
    message?: string,
    data?: T
}
