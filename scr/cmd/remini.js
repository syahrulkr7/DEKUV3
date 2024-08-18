const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "remini",
    description: "Enhance an image using the Remini API.",
    usage: "< reply image >",
    cooldown: 2,
    accessableby: 0,
    category: "media",
    prefix: true,
  },

  start: async function ({ api, event, text, reply }) {
    let pathie = __dirname + `/cache/zombie.jpg`;
    const { threadID, messageID } = event;

    let mark = event.messageReply?.attachments[0]?.url || text.join(" ");

    try {
      await reply("Generating...");

      const response = await axios.get(`https://markdevs-last-api-2epw.onrender.com/api/remini?inputImage=${encodeURIComponent(mark)}`);
      const processedImageURL = response.data.image_data;

      const img = (await axios.get(processedImageURL, { responseType: "arraybuffer" })).data;

      fs.writeFileSync(pathie, Buffer.from(img, "utf-8"));

      await api.sendMessage(
        {
          body: "Processed Image",
          attachment: fs.createReadStream(pathie),
        },
        threadID,
        () => fs.unlinkSync(pathie),
        messageID
      );
    } catch (error) {
      reply(`Error processing image: ${error.message}`);
    }
  },
};
