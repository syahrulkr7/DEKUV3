module["exports"] = class {
  static config = {
    name: "insult",
    description: "Random insult generator",
    prefix: false,
    accessableby: 0,
    author: "Deku",
    cooldown: 0
  };
  static async start({ reply }) {
    const axios = require("axios")
    try {
      const res = (await axios.get("https://evilinsult.com/generate_insult.php?lang=en")).data;
      return reply(res);
    } catch (e) {
      return reply(e.message)
    }
  }
}