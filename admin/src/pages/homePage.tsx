import { useEffect, useState } from "react";
import Header from "../compose/header";
import type { Post } from "./../../types.ts";
import CreateACard from "./createACard.tsx";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/getPosts")
      .then((response) => response.json())
      .then((post) => setPosts(post))
      .catch((error) => console.error(error));
  }, []);

  return (
    <main className="min-h-screen bg-gray-800 text-white">
      <Header />
      <div className="flex flex-col items-center gap-4 p-6">
        {posts && posts.map((post) => <CreateACard post={post} />)}
      </div>
    </main>
  );
}
