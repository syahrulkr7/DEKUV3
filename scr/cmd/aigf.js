module.exports = {
  config: {
    name: "aigf",

    accessableby: 0,

    description: "Talk to virtual AI Girlfriend",

    usage: "ask",

    prefix: false,

    credits: "Deku",
    cooldown: 3
  },

  start: async function ({ text, reply, react }) {
    let p = text.join(" ");
    if (!p) return reply("Missing input!");
    const axios = require("axios");
    try {
      react("🥵");
      const a = (await axios.get(global.deku.ENDPOINT+"/api/ai-gf?q=" + encodeURI(p)))
        .data;
      return reply(a.result);
    } catch (e) {
      return reply(e.message);
    }
  },
};
