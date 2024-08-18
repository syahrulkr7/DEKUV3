const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "fbcoverv1",
    version: "1.0.0",
    description: "Generate a Facebook cover image",
    usage: "[fbcoverv1 <name> <id> <subname> <color>]",
    cooldown: 5,
    accessableby: 0,
    category: "media",
    prefix: true
  },

  start: async function ({ api, event, args, reply }) {
    try {
      const input = args.join(" ").split("|").map(arg => arg.trim());
      const [name, id, subname, color] = input;

      if (!name || !id || !subname || !color) {
        return reply("Usage: fbcoverv1 name | id | nickname | color");
      }

      const url = `https://hiroshi-rest-api.replit.app/canvas/fbcoverv1?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}&subname=${encodeURIComponent(subname)}&color=${encodeURIComponent(color)}`;
      const imagePath = path.join(__dirname, "fbcoverv1.png");

      reply("Generating your Facebook cover, please wait...");

      const response = await axios({
        url: url,
        method: 'GET',
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(imagePath);
      response.data.pipe(writer);

      writer.on('finish', () => {
        api.sendMessage({
          attachment: fs.createReadStream(imagePath)
        }, event.threadID, () => {
          fs.unlinkSync(imagePath);
        });
      });

      writer.on('error', (err) => {
        console.error('Stream writer error:', err);
        reply("An error occurred while processing the request.");
      });
    } catch (error) {
      console.error('Error:', error);
      reply("An error occurred while processing the request.");
    }
  },

  auto: async function () {}
};
