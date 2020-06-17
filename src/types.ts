export type BooruResponsePost = {
  id: number;
  file_ext: string;
  /** External file url */
  file_url: string;
  /** Low-res file url for thumbnails */
  preview_file_url: string;
  tag_string: string;
  /** Artist Metadata */
  tag_string_artist: string | null;
  pixiv_id: string | null;
};

export type BooruAPIResponseTag = {
  id: number;
  name: string;
  post_count: number;
  category: number;
  updated_at: Date;
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
  thumbnails: { tag: string };
  wallpaper: { image: ImageType; type: 'search' | 'saved' | 'home' };
  results: { query: string };
  collections: undefined;
  collection: { fileName: string };
};

export type ActiveImage = {
  raw: string;
  edited?: string;
};

export type ImageType = Omit<BooruResponsePost, 'id' | 'tag_string'> & {
  /** Internal Url to cached reference */
  cropped_file_url?: string;
};

export type StorageItems = { [key: string]: ImageType };
