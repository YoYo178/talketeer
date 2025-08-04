declare namespace Express {
    interface Request {
        user: {
            id: string,
            username: string,
            email: string,
        };
    }
}