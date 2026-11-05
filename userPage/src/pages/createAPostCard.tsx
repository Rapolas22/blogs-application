import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { Post } from "../../../admin/types"

type cardProps = {
  post: Post
}

export default function CreatePostCard({ post }: cardProps) {
  return (
    <Card>
      <img
        src={post.thumbnailUrl ?? ""}
        alt="Event cover"
        className="aspect-video w-full bg-muted object-cover"
      />
      <CardHeader>
        <CardTitle className="line-clamp-2 text-lg text-balance">
          {post.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {post.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <a
          href={`user/posts/${post.id}`}
          className={buttonVariants({ variant: "default", size: "lg" })}
        >
          View post
        </a>
      </CardFooter>
    </Card>
  )
}
