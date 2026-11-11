import Header from "@/components/header";
import Card from "../../card/pages/Card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePost, getPosts } from "../api";

export default function HomePage() {
  const queryClient = useQueryClient();

  const {
    data: posts,
    isPending,
    error,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const mutation = useMutation({
    mutationFn: deletePost,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <main className="min-h-screen dark:bg-background dark:text-foreground">
      <Header />
      <div className="flex flex-col items-center gap-4 p-6">
        {isPending && <p>Loading posts...</p>}
        {isError && <p>{error.message}</p>}
        {posts &&
          posts.map((post) => (
            <Card
              key={post.id}
              post={post}
              onDelete={() => mutation.mutate(post.id)}
            />
          ))}
      </div>
    </main>
  );
}
