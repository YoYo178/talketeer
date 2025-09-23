import { z } from 'zod';

export const GIFSearchSchema = z.object({
    query: z.string().nonempty().max(64)
});

export type TGIFSearchQuery = z.infer<typeof GIFSearchSchema>;