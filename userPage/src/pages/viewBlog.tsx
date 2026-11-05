import { useEffect, useState } from "react"
import type { Post } from "../../../admin/types"
import { useParams } from "react-router-dom"
import dompurify from "dompurify"

export default function ViewBlog() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post>()

  const clean: string = dompurify.sanitize(post?.content ?? "")

  useEffect(() => {
    const loadPost = async () => {
      const response = await fetch(`/api/user/posts/${id}`)

      if (!response.ok) {
        console.log("Wrong url")
        return
      }

      const post = await response.json()

      setPost(post)
    }

    loadPost()
  }, [id])

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex min-w-3xl flex-col pt-7 pb-7">
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
      </div>
    </div>
  )
}
