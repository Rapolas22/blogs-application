import type { Post } from "../../../types";

export async function getPosts(): Promise<Post[]> {
  const res = await fetch("/api/getPosts");

  if (!res.ok) {
    throw new Error("Failed to load posts");
  }

  return res.json();
}

export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`/api/post/remove/${id}`, { method: "DELETE" });

  if (!res.ok) {
    throw new Error("Failed to delete post");
  }
}
