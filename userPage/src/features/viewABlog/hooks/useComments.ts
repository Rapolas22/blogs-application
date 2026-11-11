import { useQuery } from "@tanstack/react-query"
import { getComments } from "../api"

export function useComment(id: string) {
  return useQuery({
    queryKey: ["comments", id],
    queryFn: () => getComments(id),
  })
}
