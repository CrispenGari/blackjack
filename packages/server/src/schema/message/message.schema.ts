import { z } from "zod";

export const sendMessageSchema = z.object({
  message: z.string(),
  engineId: z.string(),
});
export const onNewMessageSchema = z.object({
  engineId: z.string(),
});
export const messagesSchema = z.object({
  engineId: z.string(),
});
