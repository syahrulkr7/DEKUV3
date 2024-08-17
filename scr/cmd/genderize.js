module["exports"] = class {
  static config = {
    name: "genderize",
    description: "Determine gender by name",
    prefix: false,
    accessableby: 0,
    usage: "[ask]",
    author: "Deku",
    react: "",
    url: global.deku.ENDPOINT+"/genderize?name=",
    cooldown: 5
  };
  static async start({ reply, text }) {
    const axios = require("axios");
    try {
      let name = text["join"](" ");
      if (!name) return reply("Missing name!");
      const res = (await axios.get(this["config"]["url"] + name))["data"];
      let names = res["name"],
        per = res["probability"],
        gender = res["gender"];
      return reply(`Name: ${names}\nGender: ${gender}\nProbability: ${per}%`);
    } catch (w) {
      return reply(w["message"]);
    }
  }
};
