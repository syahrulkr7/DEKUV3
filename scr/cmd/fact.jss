const a = process.cwd() + "/data/fact";
const b = require(a);
const fs = require("fs");
module.exports = {
  config: {
    name: "fact",
    author: "Deku",
    prefix: false,
    accessableby: 0,
    cooldown: 3,
    description: "Fact meme",
    category: "utility",
    usage: "[text]",
  },
  start: async function ({ reply, text }) {
    const c = text.join(" ");
    if (!c) return reply("Missing text.");
    const d = process.cwd() + "/data/cache/" + c + "_output.png";
    const e = await b(c);
    if (!e) return reply("Something went wrong.");
    reply({
      attachment: fs.createReadStream(d).on("end", async function () {
        if (fs.existsSync(d)) {
          fs.unlinkSync(d);
        }
      }),
    });
  },
};
