const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "slap",
    version: "1.0.0",
    description: "Slap a user using the Batman slap meme",
    usage: "[slap <mention>]",
    cooldown: 5,
    accessableby: 0,
    category: "fun",
    prefix: false
  },

  start: async function ({ api, event, reply }) {
    const ownerId = "100087212564100"; // FB UID of the owner

    try {
      if (event.messageReply) {
        const robinId = event.messageReply.senderID; // ID of the replied-to user

        if (robinId === ownerId) {
          return reply("You can't slap my owner 😎");
        }

        const batmanId = event.senderID;
        const apiUrl = `https://hiroshi-rest-api.replit.app/canvas/batmanslap?batman=${batmanId}&robin=${robinId}`;

        reply("Slapping... please wait...");

        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        const slapImagePath = path.join(__dirname, "batmanSlap.png");

        fs.writeFileSync(slapImagePath, response.data);

        api.getUserInfo(batmanId, (err, ret) => {
          if (err) {
            return reply("An error occurred while fetching user info.");
          }

          const batmanName = ret[batmanId].name;

          api.sendMessage({
            body: `${event.messageReply.body} has been slapped by ${batmanName}!`,
            mentions: [{ tag: event.messageReply.body, id: robinId }],
            attachment: fs.createReadStream(slapImagePath)
          }, event.threadID, () => {
            fs.unlinkSync(slapImagePath);
          });
        });
      } else {
        const mentions = Object.keys(event.mentions);
        if (mentions.length < 1) {
          return reply("Please mention a user to be slapped.");
        }

        const batmanId = event.senderID;
        const robinId = mentions[0];

        if (robinId === ownerId) {
          return reply("You can't slap my owner 😎");
        }

        const apiUrl = `https://hiroshi-rest-api.replit.app/canvas/batmanslap?batman=${batmanId}&robin=${robinId}`;

        reply("Slapping... please wait...");

        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        const slapImagePath = path.join(__dirname, "batmanSlap.png");

        fs.writeFileSync(slapImagePath, response.data);

        api.getUserInfo(batmanId, (err, ret) => {
          if (err) {
            return reply("An error occurred while fetching user info.");
          }

          const batmanName = ret[batmanId].name;

          api.sendMessage({
            body: `${event.mentions[robinId]} has been slapped by ${batmanName}!`,
            mentions: [{ tag: event.mentions[robinId], id: robinId }],
            attachment: fs.createReadStream(slapImagePath)
          }, event.threadID, () => {
            fs.unlinkSync(slapImagePath);
          });
        });
      }
    } catch (error) {
      console.error('Error:', error);
      reply("An error occurred while processing the request.");
    }
  },

  auto: async function () {}
};
