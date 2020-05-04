export type BooruResponsePost = {
  id: number;
  file_ext: string;
  file_url: string;
};

export type BooruAPIResponseTag = {
  id: number;
  name: string;
  post_count: number;
  category: number;
  updated_at: Date;
};
