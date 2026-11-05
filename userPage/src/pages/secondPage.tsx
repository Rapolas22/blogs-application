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
      className="flex min-h-screen flex-col items-center bg-stone-200 px-5 py-24 sm:px-8 sm:py-32 lg:px-12 dark:bg-stone-950"
    >
      <h1 className="mb-10 w-full max-w-304 font-serif text-3xl tracking-tight text-balance sm:text-4xl">
        Posts:
      </h1>
      <div className="grid w-full max-w-304 grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {traversePosts(posts)}
      </div>
    </div>
  )
}
