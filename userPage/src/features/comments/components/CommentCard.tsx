import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Comment } from "../types"
import { useDeleteComment } from "../hooks/useDeleteComment"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CommentCard({ comment }: { comment: Comment }) {
  const mutation = useDeleteComment(String(comment.postId))

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{comment.user.name ?? "Anonymous"}</CardTitle>
        <CardDescription>
          {new Date(comment.createdAt).toLocaleDateString("lt-LT")}
        </CardDescription>
        <CardAction>
          <Button
            size="icon-sm"
            variant="ghost"
            className="text-muted-foreground hover:text-destructive"
            aria-label="Delete comment"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(String(comment.id))}
          >
            <Trash2 />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="whitespace-pre-wrap">{comment.text}</CardContent>
      {/* TODO(human): show a short message when mutation.isError (e.g. 403 on someone else's comment). See CommentForm.tsx:29. */}
    </Card>
  )
}
