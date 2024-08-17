"use strict";
module.exports = {
  config: {
    name: "cdp",
    description: "Random couple dp",
    prefix: false,
    usage: "cdp",
    react: "🥰",
    accessableby: 0,
    category: "fun",
    cooldown: 4
  },
  start: async function ({ reply, react }) {
    const axios = require("axios"),
      fs = require("fs"),
      path = __dirname + "/cache/one.png",
      path1 = __dirname + "/cache/two.png";
    let images = [];
    try {
      const res = (await axios.get(global.deku.ENDPOINT+"/cdp"))
        .data;
      const img1 = (
        await axios.get(res.result.one, {
          responseType: "arraybuffer",
        })
      ).data;
      const img2 = (
        await axios.get(res.result.two, {
          responseType: "arraybuffer",
        })
      ).data;
      fs.writeFileSync(path, Buffer.from(img1, "utf-8"));
      fs.writeFileSync(path1, Buffer.from(img2, "utf-8"));
      images.push(fs.createReadStream(path));
      images.push(fs.createReadStream(path1));
      react(this.config.react);
      return reply({
        attachment: images,
      });
    } catch (e) {
      console.log(e);
      return reply(e.message);
    }
  },
};
