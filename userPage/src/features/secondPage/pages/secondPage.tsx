import CreatePostCard from "../../../pages/createAPostCard"
import { usePosts } from "../hooks/usePosts"

interface appRefs {
  ref?: React.RefObject<HTMLDivElement | null>
}

export default function SecondPage({ ref }: appRefs) {
  const { data, isPending } = usePosts()

  return (
    <div
      ref={ref}
      className="flex min-h-screen flex-col items-center bg-stone-200 px-5 py-24 sm:px-8 sm:py-32 lg:px-12 dark:bg-stone-950"
    >
      <h1 className="mb-10 w-full max-w-304 font-serif text-3xl tracking-tight text-balance sm:text-4xl">
        Posts:
      </h1>
      <div className="grid w-full max-w-304 grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {isPending && <p>Loading...</p>}
        {data?.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          data?.map((post) => <CreatePostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  )
}
