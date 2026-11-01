import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
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
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src={post.thumbnailUrl ?? ""}
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-60 dark:brightness-40"
      />
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>{post.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">View post</Button>
      </CardFooter>
    </Card>
  )
}
