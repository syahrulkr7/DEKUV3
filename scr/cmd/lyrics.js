const axios = require("axios");

module.exports = {
  config: {
    name: "lyrics",
    description: "Fetch and display lyrics for a song.",
    usage: "lyrics [song title]",
    cooldown: 5,
    accessableby: 0, // 0 = everyone
    category: "music",
    prefix: false,
    author: "churchill" // Added credits for the author
  },
  start: async function ({ api, text, react, event, reply }) {
    try {
      let query = text.join(" ");
      if (!query) {
        return reply("Missing song title for the lyrics command.");
      }

      reply("Fetching lyrics, please wait...");

      try {
        const response = await axios.get(`https://markdevs-last-api-2epw.onrender.com/search/lyrics?q=${encodeURIComponent(query)}`);
        const { lyrics, title, artist, image } = response.data.result;

        if (!lyrics || !title || !artist || !image) {
          return reply("Lyrics not found for the given query.");
        }

        const message = {
          body: `🎵 **Title:** ${title}\n👤 **Artist:** ${artist}\n\n📜 **Lyrics:**\n${lyrics}`,
          attachment: (await axios({ url: image, responseType: 'stream' })).data
        };

        reply(message);
      } catch (error) {
        console.error(error);
        reply("An error occurred while fetching the lyrics.");
      }
    } catch (error) {
      console.error("Error in lyrics command:", error);
      reply("An error occurred while processing your request.");
    }
  },
  auto: async function ({ event, reply }) {
    // No auto functionality provided in the original code.
  }
};
