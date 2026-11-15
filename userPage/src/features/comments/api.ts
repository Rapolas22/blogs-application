import type { Comment } from "./types"

export async function getComments(id: string): Promise<Comment[]> {
  const response = await fetch(`/api/user/posts/${id}/comments`)

  if (!response.ok) {
    throw new Error("Failed to fetch comments")
  }

  return (await response.json()) as Comment[]
}

export async function createComment(
  content: string,
  postId: string
): Promise<Comment> {
  const response = await fetch(`/api/user/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  })

  if (!response.ok) throw new Error("Failed to create a comment")

  return (await response.json()) as Comment
}

export async function deleteComment(
  commentId: string,
  postId: string
): Promise<Comment> {
  const response = await fetch(
    `/api/user/posts/${postId}/comments/${commentId}`,
    {
      method: "DELETE",
    }
  )

  if (!response.ok) throw new Error("Failed to delete the comment")

  return (await response.json()) as Comment
}
