const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "video",
    description: "Search video from YouTube",
    usage: "video [search]",
    prefix: true,
    accessableby: 0,
    category: "media",
    cooldown: 9,
  },
  
  start: async function ({ api, reply, text, event }) {
    try {
      const searchQuery = text.join(" ");
      if (!searchQuery) {
        return reply("Usage: video <search text>");
      }

      const ugh = await api.sendMessage(
        `⏱️ | Searching for '${searchQuery}', please wait...`,
        event.threadID
      );

      api.setMessageReaction("🕥", event.messageID, (err) => {}, true);

      const response = await axios.get(
        `https://chorawrs-sheshh.vercel.app/video?search=${encodeURIComponent(
          searchQuery
        )}`
      );

      const data = response.data;
      const videoUrl = data.downloadUrl;
      const title = data.title;
      const thumbnail = data.thumbnail;

      const videoPath = path.join(__dirname, "cache", "video.mp4");

      const videoResponse = await axios.get(videoUrl, { responseType: "arraybuffer" });

      fs.writeFileSync(videoPath, Buffer.from(videoResponse.data));

      api.setMessageReaction("✅", event.messageID, (err) => {}, true);

      await api.sendMessage(
        {
          body: `Here's your video, enjoy!🥰\n\nTitle: ${title}\nImage: ${thumbnail}`,
          attachment: fs.createReadStream(videoPath),
        },
        event.threadID,
        event.messageID
      );

      fs.unlinkSync(videoPath);
      api.unsendMessage(ugh.messageID);

    } catch (error) {
      api.sendMessage(`error: ${error.message}`, event.threadID, event.messageID);
      console.log(error);
    }
  },
  
  startReply: async function () {
    // No need for startReply as there's no follow-up interaction in this command
  },
};
