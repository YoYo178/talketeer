import { ZodType } from "zod";

export interface ValidationSchemas {
    body?: ZodType;
    query?: ZodType;
    params?: ZodType;
}