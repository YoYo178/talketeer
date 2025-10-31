import { mongooseObjectId } from '@src/utils';
import z from 'zod';

// Send message schema
export const sendMessageSchema = z.object({
  isDM: z.boolean(),
  roomId: mongooseObjectId,
  message: z.string().min(1).max(1000),
});

export type TSendMessageBody = z.infer<typeof sendMessageSchema>;

// Get messages schema
export const messagesQuerySchema = z.object({
  roomId: mongooseObjectId,
  before: z.string().optional(),
  after: z.string().optional(),
});

export type TMessagesQuery = z.infer<typeof messagesQuerySchema>;

// Message ID schema
export const messageIdParamsSchema = z.object({
  messageId: mongooseObjectId,
});

export type TMessageIdParams = z.infer<typeof messageIdParamsSchema>;

// Get DM messages schema
export const DmMessagesQuerySchema = z.object({
  roomId: mongooseObjectId,
  friendId: mongooseObjectId,
  before: z.string().optional(),
  after: z.string().optional(),
});

export type TDmMessagesQuery = z.infer<typeof DmMessagesQuerySchema>;

// Get DM message by ID schema
export const DmMessageQuerySchema = z.object({
  messageId: mongooseObjectId,
  roomId: mongooseObjectId,
  friendId: mongooseObjectId,
});

export type TDmMessageQuery = z.infer<typeof DmMessageQuerySchema>;