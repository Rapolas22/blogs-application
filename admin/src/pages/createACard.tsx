import type { Post } from "../../types.ts";

const dateFormat = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

type CardProps = {
  post: Post;
  onDelete: () => void;
};

export default function CreateACard({ post, onDelete }: CardProps) {
  const published = post.published;

  const deletePost = async (postId: Post["id"]) => {
    if (!window.confirm("Delete this post? This can't be undone.")) return;

    try {
      const res = await fetch(`/api/post/remove/${postId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Couldn't delete the post. Try again.");
        return;
      }

      onDelete();
    } catch {
      alert("Couldn't reach the server. Try again.");
    }
  };

  return (
    <article
      className={`w-full max-w-2xl flex gap-4 rounded-lg border border-gray-700 border-l-4 bg-gray-900/40 p-4 ${
        published ? "border-l-emerald-400" : "border-l-amber-400"
      }`}
    >
      {post.thumbnailUrl && (
        <img
          src={post.thumbnailUrl}
          alt=""
          className="h-24 w-32 shrink-0 rounded-md object-cover"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h4
          className={`text-xl font-semibold leading-snug ${
            post.title ? "text-white" : "italic text-gray-400"
          }`}
        >
          {post.title ?? "Untitled post"}
        </h4>

        {post.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-gray-300">
            {post.description}
          </p>
        )}

        <div className="mt-auto flex items-center gap-4 text-sm text-gray-400">
          <span
            className={`flex items-center gap-1.5 font-medium ${
              published ? "text-emerald-300" : "text-amber-300"
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${
                published ? "bg-emerald-400" : "bg-amber-400"
              }`}
            />
            {published ? "Published" : "Draft"}
          </span>
          {post.createdAt && (
            <time dateTime={post.createdAt}>
              {dateFormat.format(new Date(post.createdAt))}
            </time>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-center gap-1">
        <button
          type="button"
          aria-label="Edit post"
          className="shrink-0 rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M21 12a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1Zm-15 .76V17a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .71-.29l6.92-6.93L21.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83l-6.94 6.93a1 1 0 0 0-.29.71Zm10.76-8.35l2.83 2.83l-1.42 1.42l-2.83-2.83ZM8 13.17l5.93-5.93l2.83 2.83L10.83 16H8Z"
            />
          </svg>
        </button>

        <button
          onClick={() => deletePost(post.id)}
          type="button"
          aria-label="Delete post"
          className="shrink-0 rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            <line x1="10" x2="10" y1="11" y2="17"></line>
            <line x1="14" x2="14" y1="11" y2="17"></line>
          </svg>
        </button>
      </div>
    </article>
  );
}
