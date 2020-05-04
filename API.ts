import { BooruAPIResponseTag } from 'types';

const APIRoute = 'https://testbooru.donmai.us';

export const getMostPopularTags = async (): Promise<BooruAPIResponseTag[]> => {
  return await fetch(`${APIRoute}/tags.json?limit=1?search[order]=count`)
    .then((response) => response.json())
    .catch((e) => console.warn(e));
};
