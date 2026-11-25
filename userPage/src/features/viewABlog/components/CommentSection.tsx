import CommentCard from "../../comments/components/CommentCard"
import type { Comment } from "@/lib/utils"

function CommentSection({ comments }: { comments: Comment[] }) {
  return (
    <div className="flex flex-col gap-3">
      {comments.length === 0 ? (
        <p className="px-3 pb-4 text-plate-foreground/80">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))
      )}
    </div>
  )
}

export default CommentSection
