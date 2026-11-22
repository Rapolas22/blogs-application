import CommentCard from "../../comments/components/CommentCard"
import type { Comment } from "@/lib/utils"

function CommentSection({ comments }: { comments: Comment[] }) {
  return (
    <div className="flex flex-col gap-4">
      {comments.length === 0 ? (
        <p>No comments available.</p>
      ) : (
        comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))
      )}
    </div>
  )
}

export default CommentSection
