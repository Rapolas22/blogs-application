import type { User } from "../../../admin/types"

export { cn } from "cn"

export type CardProps = {
  post: Post
}

export type Comment = {
  id: number
  text: string
  createdAt: string
  userId: number
  postId: number
  user: { name: string | null }
}

export type Post = {
  id: number
  title: string | null
  content: string | null
  published: boolean
  createdAt: string
  author?: User
  authorId: number
  description: string | null
  seoName: string | null
  thumbnailUrl: string | null
}
