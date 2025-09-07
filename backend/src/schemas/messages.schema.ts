import z from "zod"

// Room ID schema
export const sendMessageSchema = z.object({
    roomId: z.string().min(1),
    message: z.string().min(1).max(1000)
})

export type TSendMessageBody = z.infer<typeof sendMessageSchema>