module["exports"] = class {
  static config = {
    name: "bible",
    description: "Random bible verse generator",
    prefix: false,
    accessableby: 0,
    author: "Deku",
    cooldown: 4
  };
  static async start({ reply }) {
    const axios = require("axios")
    try {
      const res = (await axios.get(global.deku.ENDPOINT + "/bible")).data;
      let ref = res.reference, verse = res.verse, msg = `📖 “${verse}”\n\n- ${ref}`;
      return reply(msg);
    } catch (e) {
      return reply(e.message)
    }
  }
}