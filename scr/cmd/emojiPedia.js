const axios = require("axios");
const cheerio = require("cheerio");
async function e(q) {
  try {
    const search = encodeURI(q);
    const { data } = await axios.get(
      "https://emojipedia.org/search?q=" + search,
    );
    const $ = cheerio.load(data);
    const emojis = [];
    $("a.EmojisList_emojis-list-item__MGP6t").each((_, element) => {
      const emoji = $(element).contents().first().text().trim();
      const name = $(element)
        .find("span.EmojisList_emojis-list-item-title__kiHdi")
        .text()
        .trim();
      emojis.push({ emoji, name });
    });
    if (emojis.length == 0) {
      return false;
    }
    return emojis;
  } catch (error) {
    console.error(error.message);
    return error.message;
  }
}
module.exports = {
  config: {
    name: "emojipedia",
    author: "Deku", // sino paba?????????????????????????????????????
    prefix: false,
    accessableby: 0,
    cooldown: 3,
    description: "Search emojipedia",
    category: "utility",
    usage: "[text]",
  },
  start: async function ({ reply, text }) {
    const query = text.join(" ");
    if (!query) {
      return reply("Please provide a search query.\nEx: emojipedia laugh");
    }
    const emojis = await e(query);
    if (!emojis) {
      return reply("No results found.");
    }
    const message = emojis
      .map((emoji) => `${emoji.emoji} - ${emoji.name}\n`)
      .join("\n");
    return reply(message);
  },
};
