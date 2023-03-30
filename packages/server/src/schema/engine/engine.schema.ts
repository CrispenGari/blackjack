import { z } from "zod";

export const createEngineSchema = z.object({
  name: z.string(),
});
