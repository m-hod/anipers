import { BooruAPIResponseTag, BooruResponsePost } from './types';
// import { filteredTags } from './constants';

/**
 * Booru API Search Rules
 * prefix .json to get json return type
 * additional parameter structure: ?keyword[keyword]=keyword
 * chain additional parameters with &
 */

const APIRoute = 'https://safebooru.donmai.us';

/* Tags */

export const getMostPopularTags = async (
  category: number,
  limit?: number,
): Promise<BooruAPIResponseTag[]> => {
  return await fetch(
    `${APIRoute}/tags.json?limit=${
      limit || 10
    }&search[order]=count&search[category]=${category}`,
  )
    .then((response) => response.json())
    .catch((e) => console.warn(e));
};

export const searchTags = async (
  tagName: string,
): Promise<BooruAPIResponseTag[]> => {
  return await fetch(
    `${APIRoute}/tags.json?limit=10&search[order]=count&search[name_matches]=${tagName}*`,
  )
    .then((response) => response.json())
    .catch((e) => console.warn(e));
};

/* Posts */

export const getRandomPostByTag = async (
  tagName: string,
): Promise<BooruResponsePost[]> => {
  return await fetch(
    `${APIRoute}/posts.json?limit=1&tags=${tagName}&random=true`,
  )
    .then((response) => response.json())
    .catch((e) => console.warn(e));
};

export const getTagPosts = async (
  tagName: string,
  page: number,
  random?: boolean,
): Promise<BooruResponsePost[]> => {
  return await fetch(
    `${APIRoute}/posts.json?limit=100&page=${page}&tags=${tagName}&random=${
      random ? 'true' : 'false'
    }`,
  )
    .then((response) => response.json())
    .catch((e) => console.warn(e));
};
