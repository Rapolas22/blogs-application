import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Comment } from "@/lib/utils"

export default function CommentCard({ comment }: { comment: Comment }) {
  return (
    <Card>
      <CardHeader>{comment.user.name}</CardHeader>
      <CardContent>{comment.text}</CardContent>
    </Card>
  )
}
