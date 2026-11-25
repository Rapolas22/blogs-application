import PostCard from "../components/PostCard"
import { usePosts } from "../hooks/usePosts"
import { LogoMark } from "@/components/logo"

interface appRefs {
  ref?: React.RefObject<HTMLDivElement | null>
}

export default function SecondPage({ ref }: appRefs) {
  const { data, isPending } = usePosts()

  return (
    <section ref={ref} className="scroll-mt-4 bg-background pb-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:box-content lg:px-12">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Latest posts
        </h2>

        {/* The "plate": the dark keyboard base the post keys sit on */}
        <div className="mt-6 rounded-3xl bg-plate p-3 sm:p-4">
          {isPending && (
            <p className="p-6 text-plate-foreground/80">Loading posts…</p>
          )}
          {data?.length === 0 ? (
            <p className="p-6 text-plate-foreground/80">
              No posts yet. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {data?.map((post, index) => (
                <PostCard key={post.id} post={post} featured={index === 0} />
              ))}
            </div>
          )}
        </div>

        <footer className="mt-16 flex items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <LogoMark className="size-5" />
            Homerow
          </span>
          <span>Written one keystroke at a time.</span>
        </footer>
      </div>
    </section>
  )
}
