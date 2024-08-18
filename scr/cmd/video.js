const path = require("path");
const axios = require("axios");
const fs = require("fs");

module.exports = {
  config: {
    name: "video",
    version: "9",
    description: "Search video from YouTube",
    category: "media",
    accessableby: 0,
    cooldown: 9,
    usage: "[video [search]",
    prefix: false
  },

  start: async function ({ api, args, event, react, reply }) {
    try {
      const searchQuery = args.join(" ");
      if (!searchQuery) {
        return reply("Usage: video <search text>");
      }

      const ugh = await reply(`⏱️ | Searching for '${searchQuery}', please wait...`);
      react("🕥");

      const response = await axios.get(`https://chorawrs-sheshh.vercel.app/video?search=${encodeURIComponent(searchQuery)}`);

      const data = response.data;
      const videoUrl = data.downloadUrl;
      const title = data.title;
      const thumbnail = data.thumbnail;

      const videoPath = path.join(__dirname, "cache", "video.mp4");

      const videoResponse = await axios.get(videoUrl, { responseType: "arraybuffer" });

      fs.writeFileSync(videoPath, Buffer.from(videoResponse.data));

      react("✅");

      await api.sendMessage(
        {
          body: `Here's your video, enjoy!🥰\n\nTitle: ${title}\nImage: ${thumbnail}`,
          attachment: fs.createReadStream(videoPath)
        },
        event.threadID,
        event.messageID
      );

      fs.unlinkSync(videoPath);
      api.unsendMessage(ugh.messageID);

    } catch (error) {
      reply(`error: ${error.message}`);
      console.log(error);
    }
  },

  auto: async function () {}
};
