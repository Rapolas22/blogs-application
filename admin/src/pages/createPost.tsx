import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type FormFields = {
  title: string;
  content: string;
  thumbnailUrl: string;
  description?: string | null;
  seoName?: string | null;
};

export default function CreatePost() {
  const navigate = useNavigate();
  const { register, control, handleSubmit, setError } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const res = await fetch("/api/postCreation", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        setError("root", {
          type: "server",
          message: "Failed to create the post.",
        });
        return;
      }

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <form
        className="mx-auto max-w-2xl space-y-4 p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl font-bold text-white">Create a new Blog</h1>
        <input
          {...register("title", { required: true, pattern: /^[A-Za-z0-9 ]+$/ })}
          className="w-full rounded border border-gray-600 bg-gray-800 p-2 text-white"
          placeholder="Title"
        />

        <input
          {...register("thumbnailUrl", { required: true })}
          className="w-full rounded border border-gray-600 bg-gray-800 p-2 text-white"
          placeholder="https://media2.dev.to/dynamic/image/width=1000..."
        />

        <input
          {...register("description", {
            required: true,
            pattern: /^[A-Za-z0-9 ]+$/,
          })}
          className="w-full rounded border border-gray-600 bg-gray-800 p-2 text-white"
          placeholder="Description"
        />

        <input
          {...register("seoName", {
            required: true,
            pattern: /^[A-Za-z0-9 ]+$/,
          })}
          className="w-full rounded border border-gray-600 bg-gray-800 p-2 text-white"
          placeholder="SEO name"
        />

        <Controller
          name="content"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Editor
              apiKey={import.meta.env.VITE_TINY_MCE_KEY}
              value={field.value}
              onEditorChange={(html) => field.onChange(html)}
              init={{
                height: 400,
                menubar: false,
                skin: "oxide-dark",
                content_css: "dark",
                plugins:
                  "lists link image table code codesample charmap wordcount",
                toolbar:
                  "undo redo | blocks | bold italic underline | bullist numlist | link image table codesample | code",
              }}
            />
          )}
        />
        <button
          className="rounded bg-blue-500 px-4 py-2 font-semibold hover:bg-blue-600 text-white"
          type="submit"
        >
          Save post
        </button>
      </form>
    </div>
  );
}
