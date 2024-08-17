const axios = require("axios");
async function trans(text, lang) {
  const translateURL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const response = await axios.get(translateURL);
    return response.data[0][0][0];
  } catch (error) {
    return error.message;
  }
}
module.exports.config = {
  name: "trans",
  usage: "[lang -> text]",
  accessableby: 0,
  prefix: false,
  description: "Translate",
  cooldown: 2,
};

module.exports.start = async function ({ text, reply }) {
  const content = text.join(" ");
  if (!content) return reply("Please enter a text to translate.");
  let translateThis = content.slice(0, content.indexOf(" -> "));
  let lang = content.substring(content.indexOf(" -> ") + 4);
  if (content.indexOf(" -> ") == -1) {
    translateThis = content;
    lang = "en";
  }
  const translated = await trans(translateThis, lang);
  reply(translated);
};
