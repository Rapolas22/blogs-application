import { useState } from "react";
import type { Post } from "../../../../types.ts";
import ToggleDialog from "../../../pages/toggleTheDialog.tsx";
import { formatPostDate } from "../../post/constants/constants.ts";
import { useDeletePost } from "../../post/hooks/useDeletePost.ts";
import AltImage from "../components/altImage.tsx";
import { ConfirmationDialog } from "../components/confirmationDialog.tsx";

type CardProps = {
  post: Post;
};

export default function CreateACard({ post }: CardProps) {
  const published = post.published;
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = post.thumbnailUrl && !imageFailed;

  const deletePost = useDeletePost();

  const handleDelete = () => {
    deletePost.mutate(post.id, {
      onError: () => alert("Couldn't delete the post. Try again."),
    });
  };

  return (
    <article
      className={`flex w-full max-w-2xl gap-5 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40 ${
        published ? "border-border" : "border-dashed border-primary/45"
      }`}
    >
      <div className="h-24 w-36 shrink-0 overflow-hidden rounded-lg bg-muted">
        {showImage ? (
          <img
            src={post.thumbnailUrl!}
            alt=""
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <AltImage />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-0.5">
        <h4
          className={`font-serif text-[1.4rem] font-semibold leading-tight ${
            post.title ? "text-foreground" : "italic text-muted-foreground"
          }`}
        >
          {post.title ?? "Untitled post"}
        </h4>

        {post.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {post.description}
          </p>
        )}

        <div className="mt-auto flex items-center gap-4 text-[13px] text-muted-foreground">
          {published ? (
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-success"
              />
              Published
            </span>
          ) : (
            <span className="rounded-full bg-primary/12 px-2 py-0.5 font-medium text-brand-text">
              Draft
            </span>
          )}
          {post.createdAt && (
            <time dateTime={post.createdAt}>{formatPostDate(post)}</time>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-1">
        <ToggleDialog props={post} />

        <ConfirmationDialog
          onConfirm={handleDelete}
          disabled={deletePost.isPending}
        />
      </div>
    </article>
  );
}
