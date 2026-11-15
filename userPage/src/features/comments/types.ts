export type Comment = {
  id: number
  text: string
  createdAt: string
  userId: number
  postId: number
  user: { name: string | null }
}

type FormValues = {
  content: string
}
