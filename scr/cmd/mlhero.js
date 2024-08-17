module["exports"] = class {
  static config = {
    name: "mlhero",
    description: "Get info of hero in Mobile Legends",
    prefix: false,
    accessableby: 0,
    author: "Deku",
    cooldown: 3
  };
  static async start({ reply, text, react }) {
    const { get } = require("axios");
    const fs = require("fs");
    const p = __dirname + '/cache/img.png';
    try {
      let ask = text["join"](" ");
      if (!ask) return reply("Missing hero name!");
      react("⏳");
      const rest = (
        await get(
          global["deku"]["ENDPOINT"] + "/api/mlhero?q=" + encodeURI(ask),
        )
      ).data;
      react("⌛");
      const b = rest.result;
      const img = b.hero_img,
        desc = b.description || "No description",
        role = b.role,
        lane = b.lane,
        speciality = b.speciality,
        date = b.release_date,
        c = b.story_info_list,
        fname = c['Full name'],
        alias = c.Alias,
        gender = c.Gender,
        species = c.Species,
        d = b.gameplay_info,
        diff = d.difficulty,
        dur = d.durability;
      const image = (await get(img, {
        responseType: "arraybuffer"
      })).data;
      fs.writeFileSync(p, Buffer.from(image, "utf-8"))
      let msg = {
        body: `•———[ 𝗛𝗘𝗥𝗢 𝗜𝗡𝗙𝗢 ]———•\n\nName: ${fname || 'Not found'}\nAlias: ${alias || "Not found"}\nDescription: ${desc || 'Not found'}\nGender: ${gender || 'Not found'}\nSpecies: ${species || 'Not found'}\nRole: ${role}\nLane: ${lane}\nSpeciality: ${speciality || 'Not found'}\nDurability: ${dur || 'Not found'}\nDifficulty: ${diff || 'Not found'}/10\nRelese Date: ${date || 'Not found'}\n\n•———[ 𝗛𝗘𝗥𝗢 𝗜𝗡𝗙𝗢 ]———•`, attachment: fs.createReadStream(p)
      }
      return reply(msg);
      //return reply(rest.result);
    } catch (e) {
      return reply(e.message);
    }
  }
};