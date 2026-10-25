import { useEffect, useState } from "react";
import Header from "../compose/header";
import type { Post } from "./../../types.ts";
import CreateACard from "./createACard.tsx";

function checkLocalStorage(): Post[] {
  try {
    const items = localStorage.getItem("posts");

    return items ? JSON.parse(items) : [];
  } catch {
    return [];
  }
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>(() => checkLocalStorage());

  // Called by a card after the server confirmed the delete
  const removePost = (id: number) => {
    const remaining = posts.filter((post) => post.id !== id);
    setPosts(remaining);
    localStorage.setItem("posts", JSON.stringify(remaining));
  };

  useEffect(() => {
    fetch("/api/getPosts")
      .then((response) => response.json())
      .then((post) => {
        setPosts(post);
        localStorage.setItem("posts", JSON.stringify(post));
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <main className="min-h-screen bg-gray-800 text-white">
      <Header />
      <div className="flex flex-col items-center gap-4 p-6">
        {posts.map((post) => (
          <CreateACard
            key={post.id}
            post={post}
            onDelete={() => removePost(post.id)}
          />
        ))}
      </div>
    </main>
  );
}
