const fs = require("fs");

module.exports = {
  config: {
    name: "help",
    accessableby: 0,
    usage: "[page]",
    prefix: true,
    cooldown: 0,
  },
  start: async function ({ text, reply }) {
    try {
      let path = process.cwd() + "/scr/cmd";
      let files = fs.readdirSync(path);
      let commands = [];
      let page = parseInt(text[0]) || 1;

      if (page < 1) return reply("Invalid page number.");

      for (let file of files) {
        if (file.endsWith(".js")) {
          let script = require(path + "/" + file).config;
          commands.push(script);
        }
      }

      let totalPages = Math.ceil(commands.length / 10);
      if (page > totalPages) return reply("Invalid page number.");

      let startIndex = (page - 1) * 10;
      let endIndex = Math.min(startIndex + 10, commands.length);

      let output = `━━𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂━━\n`;
      const commandList = commands.slice(startIndex, endIndex);

      commandList.forEach((command, index) => {
        output += `⊂⊃ ➥ ${startIndex + index + 1}. **${command.name}**\n`;
        output += `   ➛ Prefix: ${command.prefix ? "Yes" : "No"}\n`;
        output += `   ➛ Description: ${command.description || "No description"}\n`;
        output += `   ➛ Usage: ${command.usage || command.name}\n`;
        output += `   ➛ Cooldown: ${command.cooldown || "No cooldown"}\n\n`;
      });

      output += `━━━━━━━━━━━━━━━\n`;
      output += `━━𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙿𝙰𝙶𝙴 : <${page}/${totalPages}>━━\n`;
      output += `━━CHILLI 𝖠𝖨 𝖢𝖧𝖠𝖳𝖡𝖮𝖳━━\n`;
      output += `Total commands: ${commands.length}\n`;
      output += `Type "help all" to see all commands.\n`;
      output += `━━━━━━━━━━━━━━━━━━\n\n`;
      output += `𝙾𝚆𝙽𝙴𝚁: https://www.facebook.com/Churchill.Dev4100`;

      return reply({ body: output });
    } catch (e) {
      return reply(e.message);
    }
  },
};
