import "dotenv/config";
import { z } from "zod";

export const env = z
  .object({
    NODE_ENV: z.enum(["DEVELOPMENT", "PRODUCTION"]).default("DEVELOPMENT"),
    PORT: z
      .string()
      .default("5001")
      .transform((e) => Number(e)),
    WEBHOOK_BASE_URL: z.string().optional(),
    KEY: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.NODE_ENV === "PRODUCTION" && !data.KEY) {
        return false;
      }
      return true;
    },
    { message: "KEY is required in PRODUCTION environment" }
  )
  .parse(process.env);
