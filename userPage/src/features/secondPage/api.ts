import type { Post } from "../../../../admin/types"

export async function getPosts(): Promise<Post[]> {
  const response = await fetch("/api/user/posts")

  if (!response.ok) {
    throw new Error("Failed to fetch posts")
  }

  return (await response.json()) as Post[]
}
