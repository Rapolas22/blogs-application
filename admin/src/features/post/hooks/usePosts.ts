import { useEffect, useState } from "react";
import type { Post } from "../../../../types";
import { deletePost, getPosts } from "../api";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // READ: kai puslapis atsidaro, parsisiunčiam visus post'us
  useEffect(() => {
    getPosts()
      .then((data) => setPosts(data))
      .catch(() => setError("Couldn't load the posts."))
      .finally(() => setIsLoading(false));
  }, []);

  // DELETE: 1) ištrinam serveryje, 2) išimam iš sąrašo ekrane
  const removePost = async (id: number) => {
    try {
      await deletePost(id);
      setPosts((current) => current.filter((post) => post.id !== id));
    } catch {
      alert("Couldn't delete the post. Try again.");
    }
  };

  return { posts, isLoading, error, removePost };
}
