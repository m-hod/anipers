import { BooruResponsePost } from './types';
import { filteredTags, supportedFormats } from './constants';

/**
 * Remove content in brackets
 * Replace underscores with spaces
 * Capitalize each word
 * @param tagName string following 'x_y' format
 * @param removeBrackets optional, include if want to remove brackets
 */
export const parseTagName = (tagName: string, removeBrackets?: boolean) => {
  const tagNameWithBracketsRemoved = tagName.replace(/\([a-z_]*\)/gi, '');
  const tagNameWithSpacesRemoved = (removeBrackets
    ? tagNameWithBracketsRemoved
    : tagName
  ).replace(/[_]/g, ' ');

  const tagArray = tagNameWithSpacesRemoved.match(/[^\s/]+/gi);
  let parsedTagName = '';
  tagArray?.forEach((el, i) => {
    let newEl = '';
    if (el[0] === '(') {
      const upperCasedCharacter = el[1].toUpperCase();
      newEl = `(${upperCasedCharacter}${el.slice(2)}`;
    } else {
      const upperCasedCharacter = el[0].toUpperCase();
      newEl = `${upperCasedCharacter}${el.slice(1)}`;
    }
    parsedTagName = `${parsedTagName}${newEl}${
      i !== tagArray.length ? ' ' : ''
    }`;
  });
  return parsedTagName;
};

/**
 * Replace spaces with underscores
 * Lower case all words
 * @param tagName
 */
export const reverseParseTagName = (tagName: string) => {
  const parsedTagName = tagName.replace(/ /g, '_').toLowerCase();
  return parsedTagName;
};

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

/**
 * Takes a number and truncates it to a 3-4 character string followed by an abbreviation character for trailing digits
 * eg: 500,000 > 500k
 * @param num
 */
export const truncateNumber = (num: number) => {
  const numString = num.toString();
  if (numString.length < 4) {
    return num;
  }
  if (numString.length < 5) {
    return `${numString[0]}.${numString[1]}k`;
  }
  if (numString.length < 6) {
    return `${numString[0]}${numString[1]}k`;
  }
  if (numString.length < 7) {
    return `${numString[0]}${numString[1]}${numString[2]}k`;
  }
  if (numString.length < 8) {
    return `${numString[0]}.${numString[1]}m`;
  }
  if (numString.length >= 8) {
    return `${numString[0]}${numString[1]}m+`;
  }
};

/**
 * Get the trailing id and ext from a booru file url
 * eg: https://testbooru.donmai.us/data/30104268935d83777841410d43057732.png => 30104268935d83777841410d43057732.png
 * @param fileUrl
 */
export const parseFileUrl = (fileUrl: string) => {
  const urlArray = fileUrl.split('/');
  return urlArray[urlArray.length - 1];
};

/**
 * Checks if file_ext is supported, if it isn't, deletes item from set
 * Maps through tags for each response post, removing items
 * @param response
 */
export const filterAPIResponses = (responses: BooruResponsePost[]) => {
  const filteredTagsArray = [...filteredTags];
  const responsesSet = new Set(responses);
  responses.forEach((response) => {
    if (!supportedFormats.has(response.file_ext)) {
      responsesSet.delete(response);
      return;
    }
    const tags = new Set(response.tag_string.split(' '));
    for (let i = 0; i < filteredTagsArray.length; i++) {
      if (tags.has(filteredTagsArray[i])) {
        responsesSet.delete(response);
        return;
      }
    }
  });
  return [...responsesSet];
};

/**
 * Checks if file_ext is supported, if it isn't, returns true
 * Maps through the tags in a single response and returns a boolean value
 * True if a filtered tag exists, false if none
 * @param response
 */
export const checkSingleResponse = (response: BooruResponsePost) => {
  if (!supportedFormats.has(response.file_ext)) {
    return true;
  }
  const tags = new Set(response.tag_string.split(' '));
  const filteredTagsArray = [...filteredTags];
  for (let j = 0; j < filteredTagsArray.length; j++) {
    if (tags.has(filteredTagsArray[j])) {
      return true;
    }
  }
  return false;
};
