export type HTTP_METHODS = 'GET' | 'PATCH' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS';

type AUTH_ROUTES = 'LOGIN' | 'LOGOUT' | 'SIGNUP' | 'CHECK_EMAIL';
type FRIEND_ROUTES = 'SEND_FRIEND_REQUEST' | 'ACCEPT_FRIEND_REQUEST';
type MESSAGE_ROUTES = 'GET_MESSAGES' | 'GET_MESSAGE_BY_ID';
type ROOM_ROUTES = 'GET_ALL_ROOMS' | 'GET_ROOM_BY_ID';
type USER_ROUTES = 'GET_ME' | 'GET_USER';

type API_ROUTES = AUTH_ROUTES | FRIEND_ROUTES | MESSAGE_ROUTES | ROOM_ROUTES | USER_ROUTES;

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
