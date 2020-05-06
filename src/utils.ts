/**
 * Replace underscores with spaces and capitalize each word in tag name
 * @param tagName string following 'x_y' format
 */
export const parseTagName = (tagName: string) => {
  // remove content in brackets
  // capitalize after a '/'
  const spacedTagName = tagName.replace(/[_]/g, ' ');
  const tagArray = spacedTagName.match(/[^\s\/]+/gi);
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

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const truncateNumber = (num: number) => {
  const totalDigits = num.toString().length;
  console.log(totalDigits);
  if (totalDigits < 4) {
    return num;
  }
  // else if (totalDigits < )
};

truncateNumber(4691);
/*
0 > 0
00 > 00
000 > k
0000 > k
00000 > k
000000 > m+

either: number, eg: 138
or: truncated decimal: 1.6k (rounded to nearest)
or: truncated no-decimal: 566k
or: truncated indicator: 1.7m
*/
