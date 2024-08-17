const fs = require("fs");
const path = require("path");
let authorID;
module["exports"] = {
  config: {
    name: "file",
    description: "File management",
    prefix: false,
    usage: "page or view [file name]",
    accessableby: 1,
    author: "Deku",
    category: "system",
    cooldown: 8,
  },
  start: async function ({ api, event, reply, text }) {
    const t1 = text[0],
      t2 = text[1];
    //if (!t1) return reply("Please enter a file name.");
    if (t1 == "view") {
      if (!t2) return reply("Please enter a file name.");
      const file = path.join(process.cwd(), "scr", "cmd", `${t2}.js`);
      if (!fs.existsSync(file)) return reply("File not found.");
      const code = fs.readFileSync(file, "utf-8");
      return reply(code);
    }
    const page = parseInt(t1);
    if (isNaN(page)) return reply("Please enter a valid page number.");
    const files = fs.readdirSync(path.join(process.cwd(), "scr", "cmd"));
    const totalPages = Math.ceil(files.length / 10);
    if (page > totalPages)
      return reply(`Invalid page number. Total pages: ${totalPages}`);
    let next = `To view next page, reply to this message by typing the page number.`; // : ${page + 1}
    let msg = `📁 List of available commands:\n\n`;
    for (let i = (page - 1) * 10; i < page * 10; i++) {
      if (files[i]) {
        const file = files[i];
        const name = file.replace(".js", "");
        msg += `📄 ${i + 1}. ${name}\n`;
      }
    }
    //msg += `\n${next}`;
    msg += `\n📖 Page ${page}/${totalPages}\n${next}`;
    await api.sendMessage(
      msg,
      event.threadID,
      async (err, info) => {
        authorID = event.senderID;
        if (err) return;
        global.handle.replies[info.messageID] = {
          cmdname: module.exports.config.name,
          this_mid: info.messageID,
          this_tid: info.threadID,
          tid: event.threadID,
          mid: event.messageID,
          authorID: event.senderID,
        };
      },
      event.messageID,
    );
  },

  startReply: async function ({ api, replier }) {
    try {
      //if (event.messageReply.senderID !== authorID)
      //  return api.sendMessage(
      //    "You don't have a permission to reply to this message.",
      //    replier.received.tid,
      //  );
      const files = fs.readdirSync(path.join(process.cwd(), "scr", "cmd"));
      const totalPages = Math.ceil(files.length / 10);
      const page = parseInt(replier.data.msg);
      /*if (isNaN(page) && page == "view") {
        const fileName = page.split(' ');
        const name = fileName[1];
        const file = path.join(process.cwd(), "scr", "cmd", `${name}.` + "js");
        if (!fs.existsSync(file)) return reply("File not found.");
      }*/
      if (isNaN(page))
        return api.sendMessage("Invalid page number.", replier.received.tid);
      if (page > totalPages)
        return api.sendMessage(
          `Invalid page number. Total pages: ${totalPages}`,
          replier.received.tid,
        );
      let next = `To view next page, reply to this message by typing the page number.`; // : ${page + 1}
      let msg = `📁 List of available commands:\n\n`;
      for (let i = (page - 1) * 10; i < page * 10; i++) {
        if (files[i]) {
          const file = files[i];
          const name = file.replace(".js", "");
          msg += `📄 ${i + 1}. ${name}\n`;
        }
      }
      //msg += `\n${next}`;
      msg += `\n📖 Page ${page}/${totalPages}\n${next}`;
      await api.sendMessage(
        msg,
        replier.received.tid,
        async (err, info) => {
          if (err) return;
          global.handle.replies[info.messageID] = {
            cmdname: module.exports.config.name,
            this_mid: info.messageID,
            this_tid: info.threadID,
            tid: replier.received.tid,
            mid: replier.received.mid,
          };
        },
        replier.received.mid,
      );
    } catch (e) {
      return api.sendMessage(e.message, replier.received.tid);
    }
  },
};
