import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createComment } from "../api"

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (content: string) => createComment(content, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
  })
}
