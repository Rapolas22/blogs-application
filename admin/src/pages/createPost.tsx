import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";

type FormFields = {
  title: string;
  content: string;
};

export default function CreatePost() {
  const { register, control, handleSubmit } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log(data);
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
        <Controller
          name="content"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
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
