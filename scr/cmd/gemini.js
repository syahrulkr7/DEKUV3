const axios = require("axios");
const { error } = require("console");
async function aic(q, uid) {
  const r = (
    await axios.get(`${global.deku.ENDPOINT}/gemini?prompt=${q}&uid=${uid}`)
  ).data;
  return r;
}
module.exports = {
  config: {
    name: "gemini",
    description: "Talk to Gemini (conversational)",
    prefix: false,
    usage: "[ask]",
    accessableby: 0,
    cooldown: 0
  },
  startReply: async function ({ api, replier }) {
    await api.sendMessage(
      "[ 𝙶𝙴𝙼𝙸𝙽𝙸 𝙰𝙸 ]\n\n" +
        "⏳ Searching for answer..." +
        '\n\n[ 𝚃𝚢𝚙𝚎 "𝚌𝚕𝚎𝚊𝚛" 𝚝𝚘 𝚛𝚎𝚜𝚎𝚝 𝚝𝚑𝚎 𝚌𝚘𝚗𝚟𝚎𝚛𝚜𝚊𝚝𝚒𝚘𝚗 𝚠𝚒𝚝𝚑 𝙰𝙸 ]',
      replier.received.tid,
      async (err, info) => {
        const r = await aic(replier.data.msg, replier.received.uid);
        if (err) return;
        api.editMessage(
          "[ 𝙶𝙴𝙼𝙸𝙽𝙸 𝙰𝙸 ]\n\n" +
            r.gemini +
            "\n[ 𝚁𝙴𝙿𝙻𝚈 𝚃𝙾 𝚃𝙷𝙸𝚂 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 𝚃𝙾 𝙲𝙾𝙽𝚃𝙸𝙽𝚄𝙴 𝚃𝙷𝙴 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽 𝚆𝙸𝚃𝙷 𝙰𝙸 ]",
          info.messageID,
        );
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
  },
  start: async function ({ text, api, reply, react, event }) {
    let p = text.join(" "),
      uid = event.senderID;
    if (!p) return reply("Please enter a prompt.");
    react("✨");
    try {
      await api.sendMessage(
        "[ 𝙶𝙴𝙼𝙸𝙽𝙸 𝙰𝙸 ]\n\n" +
          "⏳ Searching for answer..." +
          "\n\n[ 𝚁𝙴𝙿𝙻𝚈 𝚃𝙾 𝚃𝙷𝙸𝚂 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 𝚃𝙾 𝙲𝙾𝙽𝚃𝙸𝙽𝚄𝙴 𝚃𝙷𝙴 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽 𝚆𝙸𝚃𝙷 𝙰𝙸 ]",
        event.threadID,
        async (error, info) => {
          if (error) return;
          const r = await aic(p, uid);
          api.editMessage(
            "[ 𝙶𝙴𝙼𝙸𝙽𝙸 𝙰𝙸 ]\n\n" +
              r.gemini +
              "\n[ 𝚁𝙴𝙿𝙻𝚈 𝚃𝙾 𝚃𝙷𝙸𝚂 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 𝚃𝙾 𝙲𝙾𝙽𝚃𝙸𝙽𝚄𝙴 𝚃𝙷𝙴 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽 𝚆𝙸𝚃𝙷 𝙰𝙸 ]",
            info.messageID,
          );
          global.handle.replies[info.messageID] = {
            cmdname: module.exports.config.name,
            tid: event.threadID,
            mid: event.messageID,
            this_mid: info.messageID,
            this_tid: info.threadID,
          };
        },
        event.messageID,
      );
    } catch (g) {
      return reply(g.message);
    }
  },
};
