import { z } from "zod";

export const environmentSchema = z.object({
  AWS_ENDPOINT: z.string(),
  AWS_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_FORCE_PATH_STYLE: z.string().optional(),
  AWS_BUCKET_NAME: z.string(),
  JWT_SECRET: z.string(),
});

export const environment = environmentSchema.parse(process.env);
