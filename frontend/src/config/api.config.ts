import axios from "axios";
import type { Endpoints } from "../types/api.types";

const isProduction = import.meta.env.PROD;

export const SERVER_URL = isProduction ? 'https://sp-az.duckdns.org' : 'http://localhost:3000';
const API_URL = isProduction ? SERVER_URL + '/talketeer/api' : SERVER_URL + '/api';

export const SOCKET_SERVER_URL = SERVER_URL;

export const API = axios.create({
    baseURL: API_URL
})

// Endpoints config
export const APIEndpoints: Endpoints = {
    // Auth routes
    LOGIN: {
        METHOD: 'POST',
        URL: '/auth/login'
    },
    LOGOUT: {
        METHOD: 'POST',
        URL: '/auth/logout'
    },
    SIGNUP: {
        METHOD: 'POST',
        URL: '/auth/signup'
    },
    CHECK_EMAIL: {
        METHOD: 'POST',
        URL: '/auth/check-email'
    },

    // Friend routes
    SEND_FRIEND_REQUEST: {
        METHOD: 'POST',
        URL: '/friends'
    },
    ACCEPT_FRIEND_REQUEST: {
        METHOD: 'PATCH',
        URL: '/friends/:userId'
    },

    // Room Routes
    GET_ALL_ROOMS: {
        METHOD: 'GET',
        URL: '/rooms'
    },
    CREATE_ROOM: {
        METHOD: 'POST',
        URL: '/rooms'
    },
    GET_ROOM_BY_ID: {
        METHOD: 'GET',
        URL: '/rooms/:roomId'
    },
    JOIN_ROOM: {
        METHOD: 'POST',
        URL: '/rooms/:roomId/members'
    },
    LEAVE_ROOM: {
        METHOD: 'DELETE',
        URL: '/rooms/:roomId/members/me'
    },
    KICK_USER_FROM_ROOM: {
        METHOD: 'DELETE',
        URL: '/rooms/:roomId/members/:userId'
    },
    BAN_USER_FROM_ROOM: {
        METHOD: 'PATCH',
        URL: '/rooms/:roomId/members/:userId'
    },

    // User routes
    GET_ME: {
        METHOD: 'GET',
        URL: '/users/me'
    },
    GET_USER: {
        METHOD: 'GET',
        URL: '/users/:userId'
    }
}