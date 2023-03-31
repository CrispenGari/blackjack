import { z } from "zod";

export const createEngineSchema = z.object({
  name: z.string(),
});
export const joinEngineSchema = z.object({
  engineId: z.string(),
});
export const engineSchema = z.object({
  engineId: z.string(),
});
export const onEngineStateChangedSchema = z.object({
  engineId: z.string(),
});
