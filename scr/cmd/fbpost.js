const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "fbpost",
    description: "Create a Facebook post using the provided text and name.",
    usage: "[fbpost @mention | text | name] or [fbpost text | name]",
    prefix: true,
    accessableby: 0,
    category: "fun",
    cooldown: 5,
  },

  start: async function ({ api, event, args, react }) {
    try {
      if (args.length === 0) {
        return api.sendMessage(
          "Usage: fbpost @mention | text | name or fbpost text | name",
          event.threadID
        );
      }

      const input = args.join(" ").split("|");

      if (input.length < 1) {
        return api.sendMessage(
          "Please provide at least text and optionally a name, separated by '|'.",
          event.threadID
        );
      }

      let mention, text, name;
      let mentionId;

      if (input[0].includes("@")) {
        mention = input[0].trim();
        text = input[1] ? input[1].trim() : "";
        name = input.length > 2 ? input[2].trim() : mention.replace(/^@/, "");

        mentionId = Object.keys(event.mentions).find(
          (id) => event.mentions[id] === mention
        );

        if (!mentionId) {
          return api.sendMessage(
            "Invalid mention. Please mention a valid user.",
            event.threadID
          );
        }
      } else {
        text = input[0].trim();
        name = input.length > 1 ? input[1].trim() : event.senderID;
        mentionId = event.senderID;
      }

      api.sendMessage("Creating the Facebook post, please wait...", event.threadID);

      const response = await axios.get(
        `https://ggwp-ifzt.onrender.com/canvas/fbpost?uid=${mentionId}&text=${encodeURIComponent(
          text
        )}&name=${encodeURIComponent(name)}`,
        { responseType: "arraybuffer" }
      );
      const buffer = Buffer.from(response.data, "binary");
      const filePath = path.join(__dirname, `${mentionId}.jpg`);

      fs.writeFileSync(filePath, buffer);

      await api.sendMessage(
        {
          body: `Here is the Facebook post for ${name}:`,
          attachment: fs.createReadStream(filePath),
        },
        event.threadID,
        () => {
          fs.unlinkSync(filePath);
        }
      );

      react("👍");
    } catch (error) {
      console.error("Error:", error);
      api.sendMessage(
        "An error occurred while processing the request.",
        event.threadID
      );
    }
  },
};
