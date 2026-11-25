import { useForm } from "react-hook-form"

import { useCreateComment } from "../hooks/useCreateComments"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

type CommentFormValues = {
  content: string
}

// Shown at the bottom of the comments, always visible (no popup).
export function CommentForm({ postId }: { postId: string }) {
  const { register, handleSubmit, reset } = useForm<CommentFormValues>({
    defaultValues: { content: "" },
  })

  const mutation = useCreateComment(postId)

  return (
    <form
      onSubmit={handleSubmit((values) =>
        mutation.mutate(values.content, {
          // empty the box once the comment is saved
          onSuccess: () => reset(),
        })
      )}
      className="rounded-2xl bg-card p-4 pb-5 shadow-[inset_0_-5px_0_var(--key-edge)]"
    >
      <Textarea
        aria-label="Your comment"
        placeholder="What did you think of this post?"
        className="min-h-28 bg-background/60"
        {...register("content", { required: "A comment is required" })}
        disabled={mutation.isPending}
      />
      {mutation.isError && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          Couldn't post your comment. Please try again.
        </p>
      )}
      <div className="mt-3 flex justify-end">
        <Button type="submit" size="lg" disabled={mutation.isPending}>
          {mutation.isPending ? "Posting…" : "Post comment"}
        </Button>
      </div>
    </form>
  )
}
