import type { Post } from "../../../../types.ts";
import { dateFormat } from "../../../lib/utils.ts";

export function formatPostDate(post: Post): string {
  const date = new Date(post.createdAt);
  return date.toLocaleDateString(undefined, dateFormat);
}
