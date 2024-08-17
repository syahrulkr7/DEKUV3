module.exports = {
  config: {
    name: "kiss",
    description: "kiss",
    prefix: false,
    accessableby: 0,
    category: "info",
    cooldown: 3,
    usage: "[mention, reply, uid]",
  },
  start: async function ({ api, event, reply }) {
    const { messageID, senderID, threadID } = event;
    const userID = senderID;
    const userID2 = Object.keys(event.mentions);
    if (!userID2[0])
      return reply("Please mention someone", event.threadID, event.messageID);
    const DIG = require("discord-image-generation");
    const request = require("node-superfetch");
    const fs = require("fs-extra");
    const id = userID;
    const id2 = userID2[0];
    const avatar = (
      await request.get(
        `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      )
    ).body;
    const avatar2 = (
      await request.get(
        `https://graph.facebook.com/${id2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      )
    ).body;
    let img = await new DIG.Kiss().getImage(avatar, avatar2);
    var p = __dirname + "/cache/trigger.png";
    fs.writeFileSync(p, Buffer.from(img, "utf-8"));
    api.sendMessage(
      { attachment: fs.createReadStream(p) },
      threadID,
      () => fs.unlinkSync(p),
      messageID,
    );
  },
};
