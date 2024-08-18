const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "4k",
    version: "1.0.0",
    description: "Enhance an image",
    usage: "[4k]",
    cooldown: 5,
    accessableby: 0,
    category: "image",
    prefix: false
  },

  start: async function ({ api, event, reply }) {
    try {
      if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
        return reply("Please reply to an image with this command to enhance it.");
      }

      const attachment = event.messageReply.attachments[0];

      if (attachment.type !== 'photo') {
        return reply("Please reply to a valid image to enhance.");
      }

      const imageUrl = attachment.url;
      const apiUrl = `https://hiroshi-rest-api.replit.app/tools/remini?url=${encodeURIComponent(imageUrl)}`;

      reply("Enhancing the image, please wait...");

      const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
      const enhancedImagePath = path.join(__dirname, "enhancedImage.png");

      fs.writeFileSync(enhancedImagePath, response.data);

      api.sendMessage({
        body: "Here is your enhanced image:",
        attachment: fs.createReadStream(enhancedImagePath)
      }, event.threadID, () => {
        fs.unlinkSync(enhancedImagePath);
      });

    } catch (error) {
      console.error('Error:', error);
      reply("An error occurred while processing the request.");
    }
  },

  auto: async function () {}
};
