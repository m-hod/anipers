import { BooruAPIResponseTag, BooruResponsePost } from './types';

/**
 * Booru API Search Rules
 * prefix .json to get json return type
 * additional parameter structure: ?keyword[keyword]=keyword
 * chain additional parameters with &
 */

const APIRoute = 'https://danbooru.donmai.us';

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

export const getRandomPostByTag = async (
  tagName: string,
): Promise<BooruResponsePost[]> => {
  return await fetch(
    `${APIRoute}/posts.json?limit=1&tags=${tagName}&random=true`,
  )
    .then((response) => response.json())
    .catch((e) => console.warn(e));
};
