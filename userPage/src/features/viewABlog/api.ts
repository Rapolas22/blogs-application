import type { Comment, Post } from "../../lib/utils"

export async function getPostById(id: string): Promise<Post> {
  const response = await fetch(`/api/user/posts/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch post")
  }

  return (await response.json()) as Post
}

export async function getComments(id: string): Promise<Comment[]> {
  const response = await fetch(`/api/user/posts/${id}/comments`)

  if (!response.ok) {
    throw new Error("Failed to fetch comments")
  }

  return (await response.json()) as Comment[]
}
