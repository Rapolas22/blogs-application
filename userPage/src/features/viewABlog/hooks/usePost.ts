import { queryOptions, useQuery } from "@tanstack/react-query"
import { getPostById } from "../api"

export const postQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["post", id],
    queryFn: () => getPostById(id),
    enabled: Boolean(id),
  })

export function usePost(id: string) {
  return useQuery(postQueryOptions(id))
}
