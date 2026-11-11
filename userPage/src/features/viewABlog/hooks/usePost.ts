import { useQuery } from "@tanstack/react-query"
import { getPostById } from "../api"

export function usePost(id: string) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(id),
  })
}
