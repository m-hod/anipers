import { BooruAPIResponseTag, BooruResponsePost } from './types';
import { checkSingleResponse, filterAPIResponses } from './utils';
// import { filteredTags } from './constants';

/**
 * Booru API Search Rules
 * prefix .json to get json return type
 * additional parameter structure: ?keyword[keyword]=keyword
 * chain additional parameters with &
 */

const APIRoute = 'https://safebooru.donmai.us';

/* Tags */

/** Get top 10 most popular tags in the category
 * @param category
 */
export const getMostPopularTags = async (
  category: number,
): Promise<BooruAPIResponseTag[]> => {
  return await fetch(
    `${APIRoute}/tags.json?limit=10&search[order]=count&search[category]=${category}`,
  )
    .then((response) => response.json())
    .catch((e) => console.warn(e));
};

/**
 * Search for the ten closest tags to the input query
 * @param tagName search query for tag
 */
export const searchTags = async (
  tagName: string,
): Promise<BooruAPIResponseTag[]> => {
  return await fetch(
    `${APIRoute}/tags.json?limit=10&search[order]=count&search[name_matches]=*${tagName}*`,
  )
    .then((response) => response.json())
    .catch((e) => console.warn(e));
};

/* Posts */

/**
 * Get a random post from a tag, filter it, and recurse if filter requirements not met
 * @param tagName tag to retrieve post from
 */
export const getRandomPostByTag = async (
  tagName: string,
): Promise<BooruResponsePost[]> => {
  console.log('api call');
  const data: BooruResponsePost[] = await fetch(
    `${APIRoute}/posts.json?limit=1&tags=${tagName}&random=true`,
  )
    .then((response) => response.json())
    .catch((e) => console.warn(e));
  if (checkSingleResponse(data[0])) {
    return getRandomPostByTag(tagName);
  }
  return data;
};

/**
 * Get an assortment of posts from a tag
 * @param tagName tag to retrieve posts from
 * @param page page of tags to receive
 * @param random randomize the tags to receive
 */
export const getTagPosts = async (
  tagName: string,
  page: number,
  random?: boolean,
): Promise<BooruResponsePost[]> => {
  const data: BooruResponsePost[] = await fetch(
    `${APIRoute}/posts.json?limit=50&page=${page}&tags=${tagName}&random=${
      random ? 'true' : 'false'
    }`,
  )
    .then((response) => response.json())
    .catch((e) => console.warn(e));
  console.log(filterAPIResponses(data));
  return filterAPIResponses(data);
};
