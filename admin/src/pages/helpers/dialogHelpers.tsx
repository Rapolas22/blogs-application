import type { Post } from "../../../types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import type { FormFields } from "../createPost";

type EditPostFormProps = {
  postId: number;
};

async function fetchPostById(postId: number): Promise<Post> {
  try {
    const response = await fetch(`/api/getPosts/${postId}`);

    const fetchedPostData: Post = await response.json();

    return fetchedPostData;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export default function EditPostForm({ postId }: EditPostFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { isLoading },
  } = useForm<FormFields>({
    defaultValues: async () => {
      const post = await fetchPostById(postId);

      return {
        title: post.title ?? "",
        content: post.content ?? "",
        thumbnailUrl: post.thumbnailUrl ?? "",
        description: post.description ?? "",
        seoName: post.seoName ?? "",
      };
    },
  });

  const updatePost: SubmitHandler<FormFields> = async (data) => {
    const res = await fetch(`/api/patchPosts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      <DialogHeader>
        <DialogTitle>Edit post</DialogTitle>
        <DialogDescription>
          Make changes to your post here. Click save when you&apos;re done.
        </DialogDescription>
      </DialogHeader>

      {isLoading ? (
        <p className="py-8 text-center text-muted-foreground">Loading post…</p>
      ) : (
        <FieldGroup>
          <Field>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
          </Field>
          <Field>
            <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
            <Input id="thumbnailUrl" {...register("thumbnailUrl")} />
          </Field>
          <Field>
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register("description")} />
          </Field>
          <Field>
            <Label htmlFor="seoName">SEO Name</Label>
            <Input id="seoName" {...register("seoName")} />
          </Field>
          <Field>
            <Controller
              name="content"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Editor
                  apiKey={import.meta.env.VITE_TINY_MCE_KEY}
                  value={field.value ?? ""}
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
          </Field>
        </FieldGroup>
      )}

      <DialogFooter>
        <DialogClose render={<Button variant="outline">Cancel</Button>} />
        <Button type="submit" disabled={isLoading}>
          Save changes
        </Button>
      </DialogFooter>
    </form>
  );
}
