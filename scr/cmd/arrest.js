const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
  config: {
    name: "arrest",
    description: "Arrest the rapist",
    usage: "[@tag]",
    cooldown: 5,
    accessableby: 0,
    category: "image",
    prefix: true
  },
  start: async function ({ api, event, text, react, reply }) {
    const mention = Object.keys(event.mentions);
    if (mention.length == 0) {
      return reply("Please mention someone.");
    } else {
      const one = mention.length === 1 ? event.senderID : mention[1];
      const two = mention[0];

      try {
        const imagePath = await bal(one, two);
        reply({ 
          body: "You are under arrest", 
          attachment: fs.createReadStream(imagePath) 
        });

        // Clean up the file after sending
        fs.unlinkSync(imagePath);
      } catch (error) {
        console.error('Error:', error);
        reply("An error occurred while processing the request.");
      }
    }
  }
};

async function bal(one, two) {
  let avone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  avone.circle();
  
  let avtwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  avtwo.circle();
  
  let img = await jimp.read("https://i.imgur.com/ep1gG3r.png");
  img.resize(500, 500)
     .composite(avone.resize(100, 100), 375, 9)
     .composite(avtwo.resize(100, 100), 160, 92);

  const pth = "arrest.png";
  await img.writeAsync(pth);

  return pth;
}
