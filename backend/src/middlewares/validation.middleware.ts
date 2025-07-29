import { ValidationSchemas } from "@src/types";
import type { Request, Response, NextFunction } from "express"
import type { ZodError } from "zod"

export const validate = (schemas: ValidationSchemas) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (schemas.body) {
                const result = schemas.body.safeParse(req.body);
                if (!result.success) throw result.error;
                req.body = result.data;
            }

            if (schemas.query) {
                const result = schemas.query.safeParse(req.query);
                if (!result.success) throw result.error;
                // @ts-ignore
                req.query = result.data;
            }

            if (schemas.params) {
                const result = schemas.params.safeParse(req.params);
                if (!result.success) throw result.error;
                // @ts-ignore
                req.params = result.data;
            }

            next();
            return;
        } catch (err) {
            const error = err as ZodError;
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.flatten().fieldErrors
            })
            return;
        }
    }
}