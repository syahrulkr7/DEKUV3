const fs = require("fs");
const path = __dirname + "/cache/post.png";
module["exports"] = class {
  static config = {
    name: "post",
    description: "Facebook post (edited)",
    prefix: false,
    accessableby: 0,
    author: "Deku",
    cooldown: 0,
  };
  static async start({ event, api, reply, text }) {
    const post = text.join(" ");
    if (!post) return reply("Missing text to post!");
    const uid = event.senderID;
    const name = (await api.getUserInfo(uid)).name;
    const { get } = require("axios");
    const url = global.deku.ENDPOINT;
    const { threadID, messageID } = event;
    const ep =
      "/canvas/fbpost?uid=" +
      parseInt(uid) +
      "&text=" +
      encodeURI(post) +
      "&name=" +
      encodeURI(name);
    const image = (await get(url + ep, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(path, Buffer.from(image, "utf-8"));
    api.sendMessage(
      { attachment: fs.createReadStream(path) },
      threadID,
      messageID);
  }
};
