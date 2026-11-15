import { queryOptions, useQuery } from "@tanstack/react-query"
import { getComments } from "../api"

export const commentsQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId),
    enabled: Boolean(postId),
  })

export function useComments(postId: string) {
  return useQuery(commentsQueryOptions(postId))
}
