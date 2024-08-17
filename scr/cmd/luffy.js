const axios = require("axios");
async function aic(q, uid) {
  const r = (
    await axios.get(`${global.deku.ENDPOINT}/pai/luffy?q=${q}&uid=${uid}`)
  ).data;
  return r;
}
module["exports"] = {
  config: {
    name: "luffy",
    description: "Talk to Luffy AI",
    prefix: false,
    accessableby: 0,
    author: "Deku",
    cooldown: 0
  },
  startReply: async function ({ api, replier }) {
    const r = await aic(replier.data.msg, replier.received.uid);
    await api.sendMessage(
      "[ 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽𝙰𝙻 𝙰𝙸 ]\n\n" +
        r.result +
        '\n\n[ 𝚃𝚢𝚙𝚎 "𝚌𝚕𝚎𝚊𝚛" 𝚝𝚘 𝚛𝚎𝚜𝚎𝚝 𝚝𝚑𝚎 𝚌𝚘𝚗𝚟𝚎𝚛𝚜𝚊𝚝𝚒𝚘𝚗 𝚠𝚒𝚝𝚑 𝙰𝙸 ]',
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
      }, // end of  async (err, info)
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
        "[ 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽𝙰𝙻 𝙰𝙸 ]\n\n" +
          r.result +
          "\n\n[ 𝚁𝙴𝙿𝙻𝚈 𝚃𝙾 𝚃𝙷𝙸𝚂 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 𝚃𝙾 𝙲𝙾𝙽𝚃𝙸𝙽𝚄𝙴 𝚃𝙷𝙴 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽 𝚆𝙸𝚃𝙷 𝙲𝙷𝙰𝚁𝙰𝙲𝚃𝙴𝚁 𝙰𝙸 ]",
        event.threadID,
        async (err, info) => {
          if (err) return;
          const r = await aic(p, uid);
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
