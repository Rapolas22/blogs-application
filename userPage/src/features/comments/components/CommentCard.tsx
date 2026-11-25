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
import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CommentCard({ comment }: { comment: Comment }) {
  const mutation = useDeleteComment(String(comment.postId))

  return (
    <Card
      size="default"
      className="rounded-2xl pb-5 shadow-[inset_0_-5px_0_var(--key-edge)] ring-0"
    >
      <CardHeader>
        <CardTitle>{comment.user.name ?? "Anonymous"}</CardTitle>
        <CardDescription>
          {new Date(comment.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
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
            <Trash />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="leading-relaxed whitespace-pre-wrap">
        {comment.text}
      </CardContent>
      {mutation.isError && (
        <p role="alert" className="px-4 text-sm text-destructive">
          Couldn't delete this comment. You can only delete your own.
        </p>
      )}
    </Card>
  )
}
