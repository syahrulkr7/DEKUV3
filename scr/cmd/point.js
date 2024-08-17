"use strict";
const fs = require("fs-extra");
const request = require("request");
const axios = require("axios");
const jimp = require("jimp");
const path = require("path");
const dirMaterial = __dirname + "/images/point.png";
if (!fs.existsSync(dirMaterial))
  request("https://i.imgur.com/OA1Jb4K.png").pipe(
    fs.createWriteStream(dirMaterial),
  );
async function makeImage({ one }) {
  const __root = path.resolve(__dirname, "images");
  let point_image = await jimp.read(__root + "/point.png");
  let pathImg = __root + `/point_${one}.png`;
  let avatarOne = __root + `/avt_${one}.png`;
  let getAvatarOne = (
    await axios.get(
      `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" },
    )
  ).data;
  fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, "utf-8"));
  let circleOne = await jimp.read(await circle(avatarOne));
  point_image.composite(circleOne.resize(57, 57), 205, 162);
  let raw = await point_image.getBufferAsync("image/png");
  fs.writeFileSync(pathImg, raw);
  fs.unlinkSync(avatarOne);
  return pathImg;
}
async function circle(image) {
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}
module.exports = {
  config: {
    name: "point",
    description: "point meme",
    prefix: false,
    accessableby: 0,
    category: "fun",
    cooldown: 3,
    usage: "[mention, reply, id]",
  },
  start: async function ({ api, event, text }) {
    const { messageReply, senderID, threadID, mentions } = event;
    const userID =
      Object.keys(mentions).length > 0
        ? Object.keys(mentions)[0]
        : text.length > 0
          ? text[0]
          : messageReply
            ? messageReply.senderID
            : senderID;
    const one = userID;
    try {
      return makeImage({ one }).then((path) =>
        api.sendMessage(
          { attachment: fs.createReadStream(path) },
          threadID,
          () => fs.unlinkSync(path),
          event.messageID,
        ),
      );
    } catch (e) {
      return api.sendMessage(e.message, threadID, event.messageID);
    }
  },
};
