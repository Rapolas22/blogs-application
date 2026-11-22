import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { CommentForm } from "@/features/comments/components/CommentForm"
import { useState } from "react"

export function CommentDialog({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={<Button variant="outline">Add a Comment</Button>}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add a comment...</AlertDialogTitle>
          <div className="max-w-full min-w-full">
            <CommentForm onSuccess={() => setOpen(false)} postId={postId} />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction form="comment-form" type="submit">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
