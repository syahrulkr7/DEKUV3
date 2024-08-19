const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "avatarv1",
    description: "Generate avatar v1",
    usage: "avatarv1",
    cooldown: 5,
    accessableby: 0,
    category: "image",
    prefix: false,
    author: "Churchill"
  },
  start: async function({ api, event, reply, react }) {
    try {
      const apiUrl = `${global.deku.ENDPOINT}/canvas/avatar?id=4&bgname=Joshua&signature=Joshua%20Sy&color=black`;

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
