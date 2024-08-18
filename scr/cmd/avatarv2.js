const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "avatarv2",
    description: "Generate avatar v2",
    usage: "[avatarv2 <id> | <bgtext> | <signature> | <color>]",
    cooldown: 5, 
    accessableby: 0, 
    category: "image", 
    prefix: false 
  },
  start: async function({ api, event, text, reply }) {
    try {
      const input = text.join(" ");
      const [id, bgtext, signature, color] = input.split(" | ");

      if (!id || !bgtext || !signature || !color) {
        return reply("Please provide all required parameters: id-1to800 | bgtext | signature | color.");
      }

      const apiUrl = `https://ggwp-ifzt.onrender.com/canvas/avatarv2?id=${encodeURIComponent(id)}&bgtext=${encodeURIComponent(bgtext)}&signature=${encodeURIComponent(signature)}&color=${encodeURIComponent(color)}`;

      reply("Generating avatar, please wait...");

      const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
      const avatarPath = path.join(__dirname, "avatar.jpg");

      fs.writeFileSync(avatarPath, response.data);

      api.sendMessage({
        body: "Here is your avatar:",
        attachment: fs.createReadStream(avatarPath)
      }, event.threadID, () => {
        fs.unlinkSync(avatarPath);
      });
    } catch (error) {
      console.error('Error:', error);
      reply("An error occurred while processing the request.");
    }
  }
};
