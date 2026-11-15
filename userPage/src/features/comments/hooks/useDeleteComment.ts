import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteComment } from "../api"

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId, postId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
  })
}
