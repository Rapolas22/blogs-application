import { useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { usePost } from "../hooks/usePost"
import { useComments } from "../hooks/useComments"
import { CommentForm } from "@/features/comments/components/CommentForm"
import BlogData from "../components/BlogData"
import CommentSection from "../components/CommentSection"
import Logo from "@/components/logo"
import ThemeSwitcher from "@/features/theme/ThemeSwitcher"
import { buttonVariants } from "@/components/ui/button"

export default function ViewBlog() {
  const { id = "" } = useParams<{ id: string }>()

  const post = usePost(id)
  const comments = useComments(id)

  if (post.isPending || comments.isPending) {
    return <StatusMessage>Loading post…</StatusMessage>
  }
  if (post.isError) {
    return <StatusMessage>Couldn't load this post.</StatusMessage>
  } else if (comments.isError) {
    return <StatusMessage>Couldn't load the comments.</StatusMessage>
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="mx-auto flex h-20 w-full max-w-6xl items-center gap-4 px-5 sm:px-8 lg:box-content lg:px-12">
        <a href="/" aria-label="Homerow home">
          <Logo />
        </a>
        <ThemeSwitcher className="ml-auto hidden sm:flex" />
        <a
          href="/"
          className={buttonVariants({
            variant: "outline",
            className: "ml-auto sm:ml-0",
          })}
        >
          <ArrowLeft />
          All posts
        </a>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 pb-24 sm:px-8">
        <BlogData post={post.data} />

        {/* Comments sit on the same dark plate as the post list */}
        <section className="mt-16 rounded-3xl bg-plate p-3 sm:p-4">
          <h2 className="mb-4 px-3 pt-3 font-display text-2xl font-bold tracking-tight text-plate-foreground">
            Comments{" "}
            <span className="font-normal text-plate-foreground/70">
              ({comments.data.length})
            </span>
          </h2>

          <CommentSection comments={comments.data} />

          <div className="mt-3">
            <CommentForm postId={id} />
          </div>
        </section>
      </main>
    </div>
  )
}

// A centred line of text for the loading and error states.
function StatusMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-5 text-muted-foreground">
      <p>{children}</p>
    </div>
  )
}
