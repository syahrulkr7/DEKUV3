const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "tiktok", // name of the command
    description: "Search TikTok videos", // description of the command
    usage: "tiktok <search>", // usage of the command
    cooldown: 5, // cooldown in seconds
    accessableby: 0, // 0 is for everyone
    category: "Search", // category of the command
    prefix: true, // requires a prefix
  },

  start: async function ({ api, event, text, reply }) {
    try {
      const searchQuery = text.join(" ");
      if (!searchQuery) {
        return reply("Usage: tiktok <search text>");
      }

      reply("🤳 | Searching, please wait...");

      const response = await axios.get(
        `https://markdevs-last-api-2epw.onrender.com/api/tiksearch?search=${encodeURIComponent(searchQuery)}`
      );

      const videos = response.data.data.videos;

      if (!videos || videos.length === 0) {
        return reply("No videos found for the given search query.");
      }

      const videoData = videos[0];
      const videoUrl = videoData.play;

      const message = `𝐓𝐢𝐤𝐭𝐨𝐤 𝐫𝐞𝐬𝐮𝐥𝐭:\n\n𝐏𝐨𝐬𝐭 𝐛𝐲: ${videoData.author.nickname}\n𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞: ${videoData.author.unique_id}\n\n𝐓𝐢𝐭𝐥𝐞: ${videoData.title}`;

      const filePath = path.join(__dirname, `/cache/tiktok_video.mp4`);
      const writer = fs.createWriteStream(filePath);

      const videoResponse = await axios({
        method: "get",
        url: videoUrl,
        responseType: "stream",
      });

      videoResponse.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          { body: message, attachment: fs.createReadStream(filePath) },
          event.threadID,
          () => fs.unlinkSync(filePath)
        );
      });
    } catch (error) {
      console.error("Error:", error);
      reply("An error occurred while processing the request.");
    }
  },

  auto: async function ({ api, event, reply }) {
    // auto-reply function, you can leave this empty if it's not needed
  },
};
