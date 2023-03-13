export const retrieveAllEmojis = (path) => {
  let emojisList = [];
  //split in case there are multiple emojis being passed
  emojisList = path.trim().split("&");
  emojisList = emojisList.map((e) => {
    let emoji = [];
    //split in case it is a combined emoji
    e.split("U+").forEach((m) => {
      if (m !== "") emoji.push(extractUnicodeValue(m));
    });
    return emoji;
  });
  return emojisList;
};

export const extractUnicodeValue = (text) => {
  return text.replace(/U\+/g, "").trim();
};

const convertUnicode = (emoji) => {
  let finalStr = "";
  emoji.forEach((c) => {
    finalStr += String.fromCodePoint(parseInt(c, 16));
  });

  return finalStr;
};
export const decodeEmojis = (emojis) => {
  return emojis.map((emoji) => {
    return convertUnicode(emoji);
  });
};
