import { useParams } from "react-router-dom"
import dompurify from "dompurify"
import { usePost } from "../hooks/usePost"
import { useComments } from "../hooks/useComments"
import CommentCard from "../../comments/components/CommentCard"
import { CommentDialog } from "@/components/AlertDialogDemo"

export default function ViewBlog() {
  const { id = "" } = useParams<{ id: string }>()

  const posts = usePost(id)
  const comments = useComments(id)

  const clean: string = dompurify.sanitize(posts.data?.content ?? "")
  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex min-w-3xl flex-col pt-7 pb-7">
        {posts.isPending && <p>Loading...</p>}
        {posts.isError && <p>Error: {posts.error.message}</p>}
        <h1 className="font-serif text-5xl tracking-normal text-balance">
          {posts.data?.title}
        </h1>
        <img
          className="object-fit mt-5 shadow-xl"
          src={posts.data?.thumbnailUrl!}
        />
        {posts.data?.content && (
          <div
            dangerouslySetInnerHTML={{
              __html: clean,
            }}
          />
        )}
        <div className="mt-10 mb-5 flex flex-row items-center justify-between">
          <h1 className="font-serif text-3xl tracking-normal text-balance">
            Comments:
          </h1>
          <CommentDialog postId={id} />
        </div>

        <div className="flex flex-col gap-4">
          {comments.isPending && <p>Loading comments...</p>}
          {comments.isError && <p>Error: {comments.error.message}</p>}
          {comments.data?.length === 0 ? (
            <p>No comments available.</p>
          ) : (
            comments.data?.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
