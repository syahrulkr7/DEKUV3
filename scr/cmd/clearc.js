module.exports.q = async (cachePath) => {
  const fs = require("fs");
  const files = fs.readdir(cachePath);
  if (files.length === 0) {
    return "burat";
  } else {
    await fs.emptyDir(cachePath);
  }
};

module.exports.config = {
  name: "clearc",
  prefix: true,
  accessableby: 0,
  description: "delete the contents of the cache folder",
  usage: "[]",
  cooldown: 0,
};

module.exports.start = async function ({ api, event }) {
  const cachePath = __dirname + "/cache";
  const result = await this.q(cachePath);
  if (result === "burat") {
    return api.sendMessage(
      "Cache folder is empty to delete",
      event.threadID,
      event.messageID,
    );
  } else {
    return api.sendMessage(
      "Deleting cache successfully",
      event.threadID,
      event.messageID,
    );
  }
};
