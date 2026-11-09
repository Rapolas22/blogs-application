export type User = {
  id: number;
  email: string;
  password: string;
};

export type Post = {
  id: number;
  title: string | null;
  content: string | null;
  published: boolean;
  createdAt: string;
  author?: User;
  authorId: number;
  description: string | null;
  seoName: string | null;
  thumbnailUrl: string | null;
};
