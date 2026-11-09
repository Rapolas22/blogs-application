import Header from "@/components/header";
import Card from "../../card/pages/Card";
import { usePosts } from "../hooks/usePosts";

export default function HomePage() {
  const { data: posts, isPending, isError } = usePosts();

  return (
    <main className="min-h-screen dark:bg-background dark:text-foreground">
      <Header />
      <div className="flex flex-col items-center gap-4 p-6">
        {isPending && <p>Loading posts...</p>}
        {isError && <p>Couldn't load the posts.</p>}
        {posts?.map((post) => (
          <Card key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
