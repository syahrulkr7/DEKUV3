module.exports = {
  config: {
    name: "trigger",
    description: "trigger meme",
    prefix: false,
    accessableby: 0,
    category: "info",
    cooldown: 3,
    usage: "[mention, reply, uid]",
  },
  start: async function ({ api, event, text }) {
    const { messageReply, messageID, senderID, threadID, mentions } = event;
    const userID =
      Object.keys(mentions).length > 0
        ? Object.keys(mentions)[0]
        : text.length > 0
          ? text[0]
          : messageReply
            ? messageReply.senderID
            : senderID;
    const DIG = require("discord-image-generation");
    const request = require("node-superfetch");
    const fs = require("fs-extra");
    const id = userID;
    const avatar = (
      await request.get(
        `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      )
    ).body;
    let img = await new DIG.Triggered().getImage(avatar);
    var p = __dirname + "/cache/trigger.gif";
    fs.writeFileSync(p, Buffer.from(img, "utf-8"));
    api.sendMessage(
      { attachment: fs.createReadStream(p) },
      threadID,
      () => fs.unlinkSync(p),
      messageID,
    );
  },
};
