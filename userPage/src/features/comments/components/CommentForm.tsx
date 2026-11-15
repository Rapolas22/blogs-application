import { useForm } from "react-hook-form"

import { useCreateComment } from "../hooks/useCreateComments"
import { Textarea } from "@/components/ui/textarea"

type CommentFormValues = {
  content: string
}

export function CommentForm({
  postId,
  onSuccess,
}: {
  postId: string
  onSuccess: () => void
}) {
  const { register, handleSubmit } = useForm<CommentFormValues>({
    defaultValues: { content: "" },
  })

  const mutation = useCreateComment(postId)

  return (
    <form
      id="comment-form"
      onSubmit={handleSubmit((values) =>
        mutation.mutate(values.content, {
          onSuccess: onSuccess,
        })
      )}
    >
      <Textarea
        {...register("content", { required: "A comment is required" })}
        disabled={mutation.isPending}
      />
      {mutation.isError && <p role="alert">Unable to post your comment.</p>}
    </form>
  )
}
