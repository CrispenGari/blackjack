import { z } from "zod";
export const registerSchema = z.object({
  phoneNumber: z.string(),
  email: z.string(),
  duid: z.string(),
});
