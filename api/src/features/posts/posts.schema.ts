import { z } from "zod";

export const postSchema = z.object({
  title: z.string().trim().nonempty(),
  description: z.string().trim().nonempty(),
  content: z.string().trim().nonempty(),
  thumbnailUrl: z.url().trim().nonempty(),
  seoName: z.string().trim().nonempty(),
});

export type postSchemaType = z.infer<typeof postSchema>;
