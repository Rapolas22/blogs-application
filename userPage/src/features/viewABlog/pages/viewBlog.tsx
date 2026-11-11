import { useParams } from "react-router-dom"
import dompurify from "dompurify"
import { usePost } from "../hooks/usePost"
import { useComment } from "../hooks/useComments"
import CommentCard from "./CommentCard"
import { AlertDialogDemo } from "@/components/AlertDialogDemo"

export default function ViewBlog() {
  const { id } = useParams<{ id: string }>()

  const {
    data: post,
    isPending: isPostPending,
    error: postError,
  } = usePost(id ?? "")
  const {
    data: comments,
    isPending: isCommentsPending,
    error: commentsError,
  } = useComment(id ?? "")

  const clean: string = dompurify.sanitize(post?.content ?? "")
  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex min-w-3xl flex-col pt-7 pb-7">
        {isPostPending && <p>Loading...</p>}
        {postError && <p>Error: {postError.message}</p>}
        <h1 className="font-serif text-5xl tracking-normal text-balance">
          {post?.title}
        </h1>
        <img
          className="object-fit mt-5 shadow-xl"
          src={post?.thumbnailUrl ?? ""}
        />
        {post?.content && (
          <div
            dangerouslySetInnerHTML={{
              __html: clean,
            }}
          />
        )}
        <div className="mt-10 flex flex-row items-center justify-between">
          <h1 className="font-serif text-3xl tracking-normal text-balance">
            Comments:
          </h1>
          <AlertDialogDemo />
        </div>

        <div className="flex flex-col gap-4">
          {isCommentsPending && <p>Loading comments...</p>}
          {commentsError && <p>Error: {commentsError.message}</p>}
          {comments?.length === 0 ? (
            <p>No comments available.</p>
          ) : (
            comments?.map((comment) => (
              <div className="mt-4 flex flex-col gap-4" key={comment.id}>
                <CommentCard key={comment.id} comment={comment} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
