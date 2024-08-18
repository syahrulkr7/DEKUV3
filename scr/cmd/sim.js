const axios = require("axios");

let simSimiEnabled = false;

module.exports = {
  config: {
    name: "sim",
    description: "Toggle SimSimi auto-reply",
    usage: "sim [on/off]",
    cooldown: 2,
    accessableby: 0, // 0 = everyone
    category: "utility",
    prefix: true,
    author: "Churchill" 
  },
  start: async function ({ api, text, react, event, reply }) {
    const { threadID, messageID } = event;
    const action = text[0]?.toLowerCase();

    if (action === "on") {
      simSimiEnabled = true;
      return reply("Sim auto-reply is now ON.");
    } else if (action === "off") {
      simSimiEnabled = false;
      return reply("Sim auto-reply is now OFF.");
    } else {
      if (!simSimiEnabled) {
        return reply("Sim auto-reply is currently OFF. Use 'sim on' to enable.");
      }
      reply("Invalid command. You can only use 'sim on' or 'sim off'.");
    }
  },
  handleEvent: async function ({ api, event }) {
    if (simSimiEnabled && event.type === "message" && event.senderID !== api.getCurrentUserID()) {
      const content = encodeURIComponent(event.body);
      const apiUrl = `https://markdevs-last-api-2epw.onrender.com/sim?q=${content}`;

      try {
        const res = await axios.get(apiUrl);
        const respond = res.data.response;

        if (res.data.error) {
          api.sendMessage(`Error: ${res.data.error}`, event.threadID);
        } else if (typeof respond === "string") {
          api.sendMessage(respond, event.threadID);
        } else {
          api.sendMessage("Received an unexpected response from the API.", event.threadID);
        }
      } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while fetching the data.", event.threadID);
      }
    }
  },
  auto: async function ({ event, reply }) {
    // No auto functionality provided in the original code, leaving empty
  }
};
