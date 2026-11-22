import type { Post } from "@/lib/utils"
import dompurify from "dompurify"

function BlogData({ post: { title, thumbnailUrl, content } }: { post: Post }) {
  return (
    <div className="flex flex-col pt-7 pb-7">
      <h1 className="font-serif text-5xl tracking-normal text-balance">
        {title ?? ""}
      </h1>
      <img className="object-fit mt-5 shadow-xl" src={thumbnailUrl ?? ""} />
      {content && (
        <div
          dangerouslySetInnerHTML={{
            __html: dompurify.sanitize(content ?? ""),
          }}
        />
      )}
    </div>
  )
}

export default BlogData
