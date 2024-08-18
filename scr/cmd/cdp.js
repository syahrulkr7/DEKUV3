const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "cdp",
    description: "Random couple dp",
    prefix: false,
    usage: "cdp",
    react: "🥰",
    accessableby: 0,
    category: "fun",
    cooldown: 4,
  },
  
  start: async function({ api, event, react, reply }) {
    try {
      const apiUrl = 'https://ggwp-ifzt.onrender.com/cdp';
      reply("𝚂𝙴𝙽𝙳𝙸𝙽𝙶 𝙲𝙳𝙿 𝙿𝙸𝙲...");

      const response = await axios.get(apiUrl);
      const imageUrls = response.data.result;

      if (!imageUrls || Object.keys(imageUrls).length === 0) {
        throw new Error("No images found in response.");
      }

      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
      }

      const imagePaths = [];
      for (const key of Object.keys(imageUrls)) {
        const imageUrl = imageUrls[key];
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        const imagePath = path.join(cacheDir, `${key}.jpeg`);
        fs.writeFileSync(imagePath, imageResponse.data);
        imagePaths.push(imagePath);
      }

      const attachments = imagePaths.map(imagePath => fs.createReadStream(imagePath));

      react(this.config.react);
      reply({
        body: "Here are your cdp images!",
        attachment: attachments
      });

      // Clean up temporary image files
      imagePaths.forEach(imagePath => fs.unlinkSync(imagePath));

    } catch (error) {
      console.error('Error:', error.message);
      reply("An error occurred while fetching the images.");
    }
  },
};
