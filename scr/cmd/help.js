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
            const path = process.cwd() + "/scr/cmd";
            const files = fs.readdirSync(path);
            const commands = [];
            const input = text.join(' ');

            for (let file of files) {
                if (file.endsWith(".js")) {
                    let script = require(path + "/" + file).config;
                    commands.push(script.name);
                }
            }

            const totalCommands = commands.length;
            const commandsPerPage = 10;
            const totalPages = Math.ceil(totalCommands / commandsPerPage);
            let page = 1;

            if (input.toLowerCase() === 'all') {
                page = 1;
            } else if (!isNaN(input) && input > 0) {
                page = parseInt(input);
            }

            if (page < 1 || page > totalPages) {
                return reply(`Invalid page number. Please choose a page between 1 and ${totalPages}.`);
            }

            const startIndex = (page - 1) * commandsPerPage;
            const endIndex = Math.min(startIndex + commandsPerPage, totalCommands);

            let output = "━━𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂━━\n";
            commands.slice(startIndex, endIndex).forEach(command => {
                output += ` ➥ ${command}\n`;
            });

            output += "━━━━━━━━━━━━━━━\n";
            output += `━━𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙿𝙰𝙶𝙴 : <${page}/${totalPages}>━━\n`;
            output += `Total commands: ${totalCommands}\n`;
            output += "━━𝙲𝙷𝙸𝙻𝙻𝙸 𝙱𝙾𝚃━━\n";
            output += 'Type "help all" to see all commands.';

            if (input.toLowerCase() === 'all') {
                let allCommandsOutput = "━━𝙰𝙻𝙻 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂━━\n";
                commands.forEach(command => {
                    allCommandsOutput += `  ➥ ${command}\n`;
                });
                allCommandsOutput += "━━━━━━━━━━━━━━━\n";
                allCommandsOutput += `Total commands: ${totalCommands}\n`;
                allCommandsOutput += "━━𝙲𝙷𝙸𝙻𝙻𝙸 𝙱𝙾𝚃━━";

                return reply({ body: allCommandsOutput });
            }

            return reply({ body: output });

        } catch (e) {
            return reply(e.message);
        }
    },
};
