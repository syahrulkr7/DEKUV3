const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "avatar1",
    description: "Generates an avatar with the specified text, signature, and color",
    usage: "Avatarv1 bgtext | signature | color",
    cooldown: 5,
    accessableby: 0,
    category: "Image",
    prefix: true,
    author: "Churchill",
  },
  start: async function ({ api, text, event, reply }) {
    let [bgtext, signature, color] = text.join(" ").split(" | ");
    bgtext = bgtext || "DefaultText";
    signature = signature || "Signature";
    color = color || "black";

    async function fetchAvatar() {
      const randomId = Math.floor(Math.random() * 800) + 1;
      const url = `https://ggwp-ifzt.onrender.com/canvas/avatarv2?id=${randomId}&bgtext=${encodeURIComponent(bgtext)}&signature=${encodeURIComponent(signature)}&color=${encodeURIComponent(color)}`;
      try {
        const response = await axios({
          url,
          responseType: 'arraybuffer',
        });

        if (response.status === 200) {
          const imageBuffer = Buffer.from(response.data, 'binary');
          const filePath = path.join(__dirname, 'avatar.jpg');
          fs.writeFileSync(filePath, imageBuffer);
          return filePath;
        }
      } catch (error) {
        return null;
      }
    }

    let avatarPath;
    while (!avatarPath) {
      avatarPath = await fetchAvatar();
    }

    const message = {
      body: `Here's your custom avatar, ${bgtext}!`,
      attachment: fs.createReadStream(avatarPath),
    };

    api.sendMessage(message, event.threadID, () => {
      fs.unlinkSync(avatarPath);
    });
  },
}
