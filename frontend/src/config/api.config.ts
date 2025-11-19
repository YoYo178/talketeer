import axios from "axios";
import type { Endpoints } from "../types/api.types";

const isProduction = import.meta.env.PROD;

export const SERVER_URL = isProduction
    ? (import.meta.env.VITE_SERVER_URL || 'https://talketeer.onrender.com')
    : (import.meta.env.VITE_DEV_SERVER_URL || 'https://localhost:3000');
export const API_URL = isProduction ? SERVER_URL + '/talketeer/api' : SERVER_URL + '/api';

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
    VERIFY_EMAIL: {
        METHOD: 'POST',
        URL: '/auth/verify-email'
    },
    RESEND_VERIFICATION: {
        METHOD: 'POST',
        URL: '/auth/resend-verification'
    },
    REQUEST_PASSWORD_RESET: {
        METHOD: 'POST',
        URL: '/auth/request-reset'
    },
    RESET_PASSWORD: {
        METHOD: 'POST',
        URL: '/auth/reset-password'
    },

    // File routes
    UPDATE_AVATAR: {
        METHOD: 'POST',
        URL: '/files/avatar'
    },

    // GIF routes
    SEARCH_GIFS: {
        METHOD: 'GET',
        URL: '/gifs'
    },

    // Room Routes
    GET_ALL_ROOMS: {
        METHOD: 'GET',
        URL: '/rooms'
    },
    GET_ROOM_BY_ID: {
        METHOD: 'GET',
        URL: '/rooms/:roomId'
    },

    GET_ALL_DM_ROOMS: {
        METHOD: 'GET',
        URL: '/rooms/dm'
    },
    GET_DM_ROOM_BY_ID: {
        METHOD: 'GET',
        URL: '/rooms/dm/:roomId'
    },
    GET_DM_ROOM_BY_FRIEND_ID: {
        METHOD: 'GET',
        URL: '/rooms/dm/friend/:friendId'
    },

    // Notification routes
    GET_NOTIFICATIONS: {
        METHOD: 'GET',
        URL: '/notifications'
    },
    GET_NOTIFICATION_BY_ID: {
        METHOD: 'GET',
        URL: '/notifications/:notificationId'
    },

    // Message routes
    GET_MESSAGES: {
        METHOD: 'GET',
        URL: '/messages'
    },
    GET_MESSAGE_BY_ID: {
        METHOD: 'GET',
        URL: '/messages/:messageId'
    },
    GET_DM_MESSAGES: {
        METHOD: 'GET',
        URL: '/messages/dm'
    },
    GET_DM_MESSAGE_BY_ID: {
        METHOD: 'GET',
        URL: '/messages/dm/:messageId'
    },

    // User routes
    GET_ME: {
        METHOD: 'GET',
        URL: '/users/me'
    },
    UPDATE_ME: {
        METHOD: 'PATCH',
        URL: '/users/me'
    },
    GET_USER: {
        METHOD: 'GET',
        URL: '/users/:userId'
    }
}