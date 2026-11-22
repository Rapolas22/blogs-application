import { useParams } from "react-router-dom"
import { usePost } from "../hooks/usePost"
import { useComments } from "../hooks/useComments"
import { CommentDialog } from "@/components/AlertDialogDemo"
import BlogData from "../components/BlogData"
import CommentSection from "../components/CommentSection"

export default function ViewBlog() {
  const { id = "" } = useParams<{ id: string }>()

  const post = usePost(id)
  const comments = useComments(id)

  if (post.isPending || comments.isPending) return <p>Loading...</p>
  if (post.isError) {
    return <p>Failed to load the post</p>
  } else if (comments.isError) {
    return <p>Failed to load the comments</p>
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col p-4">
      <BlogData post={post.data} />
      <div className="mt-10 mb-5 flex flex-row items-center justify-between">
        <h1 className="font-serif text-3xl tracking-normal text-balance">
          Comments:
        </h1>
        <CommentDialog postId={id} />
      </div>

      <CommentSection comments={comments.data} />
    </main>
  )
}
