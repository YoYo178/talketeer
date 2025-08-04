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