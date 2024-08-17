const fs = require("fs");
const path = process.cwd() + "/handle/restart.json";
const resta = JSON.parse(fs.readFileSync(path, "utf-8"));
if (!fs.existsSync(path)) {
  fs.writeFileSync(path, JSON.stringify({}, null, 2), "utf-8");
}
module.exports = {
  config: {
    name: "restart",
    prefix: true,
    author: "Deku",
    cooldown: 0,
    description: "Restart the bot",
    category: "system",
    accessableby: 1,
  },
  start: async function ({ api, event, react }) {
    let msg = "⏳ Restaring in 2 seconds...";
    react("⏳");
    api.sendMessage(
      msg,
      event.threadID,
      async (err, info) => {
        if (err) return;
        resta.id = event.threadID;
        resta.mid = event.messageID;
        fs.writeFileSync(path, JSON.stringify(resta, null, 2));
        setTimeout(() => {
          process.exit(0);
        }, 2000);
      },
      event.messageID,
    );
  },
};
