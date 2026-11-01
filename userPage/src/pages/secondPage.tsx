import CreatePostCard from "../pages/createAPostCard"

import type { Post } from "../../../admin/types"
import { useState, useEffect } from "react"

interface appRefs {
  ref?: React.RefObject<HTMLDivElement | null>
}

function traversePosts(posts: Post[]): React.ReactNode[] {
  const cards: React.ReactNode[] = []

  for (const post of posts) {
    if (post !== null) {
      cards.push(<CreatePostCard key={post.id} post={post} />)
    }
  }

  return cards
}

export default function SecondPage({ ref }: appRefs) {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    fetch("/api/user/posts")
      .then((response) => response.json())
      .then((post) => {
        setPosts(post)
      })
      .catch((error) => console.error(error))
  }, [])

  return (
    <div
      ref={ref}
      className="flex min-h-screen flex-col items-start bg-stone-200 p-20 dark:bg-stone-950"
    >
      <h1 className="mb-3">Posts:</h1>
      <div className="grid auto-rows-auto grid-cols-4 gap-10 p-0">
        {traversePosts(posts)}
      </div>
    </div>
  )
}
