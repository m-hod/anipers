/**
 * Replace underscores with spaces and capitalize each word in tag name
 * @param tagName string following 'x_y' format
 */
export const parseTagName = (tagName: string) => {
  const spacedTagName = tagName.replace('_', ' ');
  const tagArray = spacedTagName.match(/[^\s]+/gi);
  let parsedTagName = '';
  tagArray?.forEach((el, i) => {
    const upperCasedCharacter = el[0].toUpperCase();
    const newEl = `${upperCasedCharacter}${el.slice(1)}`;
    parsedTagName = `${parsedTagName}${newEl}${
      i !== tagArray.length ? ' ' : ''
    }`;
  });
  return parsedTagName;
};
