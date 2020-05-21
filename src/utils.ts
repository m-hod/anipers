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
