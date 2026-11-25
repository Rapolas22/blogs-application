import type { Post } from "@/lib/utils"
import dompurify from "dompurify"

function BlogData({
  post: { title, thumbnailUrl, content, createdAt },
}: {
  post: Post
}) {
  return (
    <article className="pt-10">
      <h1 className="font-display text-4xl leading-[1.02] font-extrabold tracking-[-0.03em] text-balance sm:text-6xl">
        {title ?? ""}
      </h1>
      <time dateTime={createdAt} className="mt-4 block text-muted-foreground">
        {new Date(createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </time>

      {thumbnailUrl && (
        <div className="mt-8 aspect-video overflow-hidden rounded-2xl bg-muted">
          <img src={thumbnailUrl} alt="" className="size-full object-cover" />
        </div>
      )}

      {/* The post's HTML comes from the admin editor, so we can't put
          Tailwind classes on it. The .post-content rules in index.css
          style its headings, lists, links and code samples instead. */}
      {content && (
        <div
          className="post-content mt-10"
          dangerouslySetInnerHTML={{
            __html: dompurify.sanitize(content ?? ""),
          }}
        />
      )}
    </article>
  )
}

export default BlogData
