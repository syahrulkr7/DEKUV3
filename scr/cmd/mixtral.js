module["exports"] = class {
  static config = {
    name: "mixtral",
    description: "Talk to Mixtral AI",
    prefix: false,
    accessableby: 0,
    author: "Deku",
    cooldown: 0
  };
  static async start({ reply, text, react }) {
    const { get } = require("axios");
    try {
      let ask = text.join(" ");
      if (!ask) return reply("Missing prompt!");
      react("⏳");
      const rest = (
        await get(global.deku.ENDPOINT + "/api/mixtral-8b?q=" + encodeURI(ask))
      ).data;
      return reply(rest.result);
    } catch (e) {
      return reply(e.message);
    }
  }
};