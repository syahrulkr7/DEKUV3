const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "avatarv2",
    description: "Generate avatar v2",
    usage: "avatarv2 <id> | <bgtext> | <signature> | <color>",
    cooldown: 5,
    accessableby: 0,
    category: "image",
    prefix: false,
    author: "Churchill"  
  },
  start: async function({ api, event, text, reply, react }) {
    try {
      const input = text.join(" ");
      const [id, bgtext, signature, color] = input.split(" | ");

      if (!id || !bgtext || !signature || !color) {
        return reply("Please provide all required parameters: id (1 to 800) | bgtext | signature | color.");
      }

  
      const apiUrl = `${global.deku.ENDPOINT}/canvas/avatarv2?id=${encodeURIComponent(id)}&bgtext=${encodeURIComponent(bgtext)}&signature=${encodeURIComponent(signature)}&color=${encodeURIComponent(color)}`;

       
      await react('⏳');

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
      
      
      await react('✅');

    } catch (error) {
      console.error('Error:', error);
      reply("An error occurred while processing the request.");
    }
  }
};
