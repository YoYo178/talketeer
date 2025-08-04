import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { IUser } from "./user.types";

export interface TTokenConfig {
    [tokenType: string]: { expiry: number }
}

export interface TDecodedToken<T> {
    valid: boolean;
    expired: boolean;
    data: T;
}

export interface TAccessTokenPayload {
    user: {
        id: string;
        email: string;
        username: string;
    };
}

export interface TRefreshTokenPayload {
    user: {
        id: string;
        email: string;
    };
}

export interface TVerifyAuthReturn {
    success: boolean;
    isMaliciousUser: boolean;

    error?: {
        message: string;
        code: HttpStatusCodes;
    }

    data: {
        accessToken?: string | null;
        user: Omit<IUser, 'passwordHash'> | null;
    }
}