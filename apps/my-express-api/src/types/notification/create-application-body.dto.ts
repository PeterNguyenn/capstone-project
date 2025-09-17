import { z } from "zod";

  
export const TokenRegisterSchema = z.object({
  token: z.string().min(1, "Token is required"),
  userId: z.string().optional(),
  deviceId: z.string().optional(),
  platform: z.enum(["ios", "android", "web"]).optional(),
  appVersion: z.string().optional(),
});