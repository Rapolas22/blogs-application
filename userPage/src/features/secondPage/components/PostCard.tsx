import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

import type { CardProps } from "../../../lib/utils"

// Each post is drawn as a big keycap. The first post is the "accent key":
// wider (like Enter or Shift), in the theme's main colour, with a homing bar.
// If it's the only post, it becomes a full-width spacebar (sm:only:...).
export default function PostCard({
  post,
  featured = false,
}: CardProps & { featured?: boolean }) {
  return (
    <article
      className={cn(
        "group relative flex min-h-60 flex-col rounded-2xl p-6 pb-7 transition-[translate,box-shadow] duration-150 ease-out hover:-translate-y-0.5 has-active:translate-y-1",
        featured
          ? "bg-primary text-primary-foreground shadow-[inset_0_-6px_0_rgb(0_0_0/0.2)] has-active:shadow-[inset_0_-2px_0_rgb(0_0_0/0.2)] sm:col-span-2 sm:only:col-span-full"
          : "bg-card text-card-foreground shadow-[inset_0_-6px_0_var(--key-edge)] has-active:shadow-[inset_0_-2px_0_var(--key-edge)]"
      )}
    >
      <time
        dateTime={post.createdAt}
        className={cn(
          "text-sm",
          featured ? "text-primary-foreground" : "text-muted-foreground"
        )}
      >
        {new Date(post.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </time>

      <h3 className="mt-3 font-display text-2xl leading-tight font-bold tracking-tight text-balance">
        {/* The ::after on this link stretches over the whole key,
            so clicking anywhere on it opens the post. */}
        <a
          href={`user/posts/${post.id}`}
          className="rounded-sm outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-3 focus-visible:after:ring-ring/60"
        >
          {post.title}
        </a>
      </h3>

      <p
        className={cn(
          "mt-2 line-clamp-3",
          featured ? "text-primary-foreground" : "text-muted-foreground"
        )}
      >
        {post.description}
      </p>

      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium">
        Read post
        <ArrowRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
      </span>

      {/* the homing bar, only on the accent key (like the F and J keys) */}
      {featured && (
        <span
          aria-hidden="true"
          className="absolute bottom-5 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-primary-foreground/70"
        />
      )}
    </article>
  )
}
