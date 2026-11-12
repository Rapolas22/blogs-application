import { z } from "zod";

const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment can't be empty")
    .max(120, "Exceeded the limit of characters"),
});

type commentType = z.infer<typeof commentSchema>;

export { commentSchema };
