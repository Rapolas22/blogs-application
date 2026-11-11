import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import RemoveIcon from "./removeIcon.tsx";

type ConfirmationDialogProps = {
  onConfirm: () => void;
  disabled?: boolean;
};

export function ConfirmationDialog({
  onConfirm,
  disabled = false,
}: ConfirmationDialogProps) {
  const [open, setOpen] = useState(false);

  const handleContinue = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        disabled={disabled}
        render={
          <button
            type="button"
            aria-label="Delete post"
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
          >
            <RemoveIcon />
          </button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            selected blog post and remove all of its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinue}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
