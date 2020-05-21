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
  // string consisting of tags separated by spaces
  tag_list: string;
};

export type TagCategories = 'general' | 'artist' | 'copyright' | 'character';

export type TagCategoryIDS = 0 | 1 | 3 | 4;

export type MappedTagCategories = {
  [key in TagCategories]: TagCategoryIDS;
};

/* React Navigation Types */
export type RootStackParamList = {
  home: undefined;
  tags: { tag: string };
  wallpaper: { imageUrl: string };
  results: { query: string };
};
