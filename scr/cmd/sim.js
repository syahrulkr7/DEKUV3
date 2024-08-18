const axios = require("axios");

let simSimiEnabled = false;

module.exports = {
  config: {
    name: "sim",
    version: "1.2.1",
    description: "Toggle SimSimi auto-reply",
    usage: ["on", "off"],
    cooldown: 2,
    accessableby: 0,
    category: "fun",
    prefix: true
  },

  start: async function ({ api, event, args, reply }) {
    const { threadID, messageID } = event;
    const action = args[0]?.toLowerCase();

    if (action === "on") {
      simSimiEnabled = true;
      return reply("sim auto-reply is now ON.");
    } else if (action === "off") {
      simSimiEnabled = false;
      return reply("sim auto-reply is now OFF.");
    } else {
      if (!simSimiEnabled) {
        return reply("sim auto-reply is currently OFF. Use 'sim on' to enable.");
      }
      reply("Invalid command. You can only use 'sim on' or 'sim off'.");
    }
  },

  auto: async function ({ api, event }) {
    if (simSimiEnabled && event.type === "message" && event.senderID !== api.getCurrentUserID()) {
      const content = encodeURIComponent(event.body);
      const apiUrl = `https://markdevs-last-api-2epw.onrender.com/sim?q=${content}`;

      try {
        const res = await axios.get(apiUrl);
        const respond = res.data.response;

        if (res.data.error) {
          return api.sendMessage(`Error: ${res.data.error}`, event.threadID);
        } else if (typeof respond === "string") {
          return api.sendMessage(respond, event.threadID);
        } else {
          return api.sendMessage("Received an unexpected response from the API.", event.threadID);
        }
      } catch (error) {
        console.error(error);
        return api.sendMessage("An error occurred while fetching the data.", event.threadID);
      }
    }
  }
};
