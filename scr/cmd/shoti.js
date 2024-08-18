const fs = require("fs");
const axios = require("axios");
const request = require("request");

module.exports = {
  config: {
    name: "shoti",
    description: "Generate a random TikTok video.",
    usage: "",
    cooldown: 0,
    accessableby: 0,
    category: "media",
    prefix: false,
  },

  start: async function ({ api, text, event, reply }) {
    try {
      const { messageID, threadID } = event;

      api.setMessageReaction("⏳", messageID, () => {}, true);
      api.sendTypingIndicator(threadID, true);

      const prompt = text.join(" ");
      if (!prompt) {
        reply("Downloading...");
      }

      const response = await axios.post(`https://shoti-srv1.onrender.com/api/v1/get`, { apikey: `$shoti-1hg4gifgnlfdmeslom8` });

      const path = __dirname + `/cache/shoti.mp4`;
      const file = fs.createWriteStream(path);
      const rqs = request(encodeURI(response.data.data.url));
      rqs.pipe(file);

      file.on("finish", () => {
        setTimeout(() => {
          api.setMessageReaction("✅", messageID, () => {}, true);
          api.sendMessage(
            {
              body: `𝖴𝗌𝖾𝗋𝗇𝖺𝗆𝖾 : @${response.data.data.user.username}\n𝖭𝗂𝖼𝗄𝗇𝖺𝗆𝖾 : ${response.data.data.user.nickname}`,
              attachment: fs.createReadStream(path),
            },
            threadID
          );
        }, 5000);
      });

      file.on("error", (err) => {
        reply(`Error: ${err}`);
      });

    } catch (err) {
      reply(`Error: ${err}`);
    }
  },
};
