module.exports = {
  config: {
    name: "help",
    accessableby: 0,
    usage: "[page]",
    prefix: true,
    cooldown: 0,
  },
  start: async function ({ text, reply }) {
    const fs = require("fs");
    // axios = require("axios");
    try {
      // let path2 = __dirname + "/cache/images.png";
      let path = process.cwd() + "/scr/cmd";
      let files = fs.readdirSync(path);
      let commands = [];
      let page = text[0] || 1;

      if (text[0]) {
        if (page < 1) return reply("Invalid page number.");
      }
      for (let file of files) {
        if (file.endsWith(".js")) {
          let script = require(path + "/" + file).config;
          commands.push(script);
        }
      }
      let totalPages = Math.ceil(commands.length / 10);
      if (page > totalPages) return reply("Invalid page number.");
      let startIndex = (page - 1) * 10;
      let endIndex = page * 10;
      /*const rest = (await axios.get("https://api.waifu.pics/sfw/waifu")).data
          const url = rest.url
     const img = (
        await axios.get(url, {
          responseType: "arraybuffer",
        })
      ).data;
      fs.writeFileSync(path2, Buffer.from(img, "utf-8"));*/
      //let output = "·•——[ COMMAND LIST ]——•·\n\n";
      let output = "╭┈┈[ COMMAND LIST ]┈┈╮\n\n";
      const commandList = commands.slice(startIndex, endIndex);

      commandList.forEach((command, index) => {
        output += `➤〖 ${startIndex + index + 1} 〗 ${command.name}\nPrefix: ${command.prefix ? "Yes" : "No"}\nDescription: ${command.description || "No description"}\nUsage: ${command.usage || command.name}\nCooldown: ${command.cooldown || "No cooldown"}\n\n`;
      });
      output += `Page ${page} of ${totalPages}\n`;
      output += `\n╰┈┈[ COMMAND LIST ]┈┈╯`;
      return reply({ body: output });
    } catch (e) {
      return reply(e.message);
    }
  },
};
