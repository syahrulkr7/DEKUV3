const axios = require("axios");
async function aic(q, uid) {
  const r = (
    await axios.get(`${global.deku.ENDPOINT}/ai/qwen1.5-14b?q=${q}&uid=${uid}`)
  ).data;
  return r;
}
module.exports = {
  config: {
    name: "qwen",
    description: "Talk to Qwen AI (conversational)",
    prefix: false,
    usage: "[ask]",
    accessableby: 0,
    cooldown: 0
  },
  startReply: async function ({ api, replier }) {
    const r = await aic(replier.received.msg, replier.received.uid);
    await api.sendMessage(
      "[ 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽𝙰𝙻 𝙰𝙸 ]\n\n" +
        r.result +
        "\n\n[ 𝚃𝚢𝚙𝚎 \"𝚌𝚕𝚎𝚊𝚛\" 𝚝𝚘 𝚛𝚎𝚜𝚎𝚝 𝚝𝚑𝚎 𝚌𝚘𝚗𝚟𝚎𝚛𝚜𝚊𝚝𝚒𝚘𝚗 𝚠𝚒𝚝𝚑 𝙰𝙸 ]", 
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
  start: async function ({ text, api, reply, react, event, User }) {
    let p = text.join(" "),
      uid = event.senderID;
    if (!p) return reply("Please enter a prompt.");
    react("✨");
    try {
      const r = await aic(p, uid);
      await api.sendMessage(
        "[ 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽𝙰𝙻 𝙰𝙸 ]\n\n" +
          r.result +
          "\n\n[ 𝚁𝙴𝙿𝙻𝚈 𝚃𝙾 𝚃𝙷𝙸𝚂 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 𝚃𝙾 𝙲𝙾𝙽𝚃𝙸𝙽𝚄𝙴 𝚃𝙷𝙴 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽 𝚆𝙸𝚃𝙷 𝙰𝙸 ]",
        event.threadID,
        async (err, info) => {
          if (err) return;
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
