const axios = require("axios");
const fs = require("fs");
let r;
const xpath = __dirname + "/cache/x.mp4";
module.exports = {
  config: {
    name: "x",
    description: "X",
    usage: "search",
    prefix: true,
    accessableby: 0,
    category: "x",
    cooldown: 5
  },
  start: async function ({ api, reply, text, event }) {
    try {
      function remove(url) {
        return url.replace(/\./g, "(.)");
      }
      const q = text.join(" ");
      if (!q) return reply("Please enter a search query.");
      api.sendMessage(
        "Searching...",
        event.threadID,
        async function (err, info) {
          if (err) return;
          const res = (
            await axios.get(`${global.deku.ENDPOINT}/api/xsearch?q=${q}`)
          ).data;
          const data = res.result.result;
          r = data;
          console.log(data);
          let msg = "[ XNXX SEARCH ]\n\n",
            count = 0;
          for (let i = 0; i < data.length; i++) {
            let links = remove(data[i].link);
            msg += `${(count += 1)}. 📝Title: ${data[i].title}\n\n🔗Link: ${links}\n\n📜Info: ${data[i].info}\n\n`;
          }
          msg +=
            "\nReply to this message with number you seleceted.\nNOTE: To avaoid error, please choose only 6-10 minutes videos.\n\n[ XNXX SEARCH ]";
          api.editMessage(msg, info.messageID);
          global.handle.replies[info.messageID] = {
            cmdname: module.exports.config.name,
            tid: event.threadID,
            mid: event.messageID,
            uid: event.senderID,
            this_mid: info.messageID,
            this_tid: info.threadID,
            step: "search",
          };
        },
        event.messageID,
      );
    } catch (e) {
      reply("err");
    }
  },
  startReply: async function ({ api, replier }) {
    // download: /api/xdl?q=
    if (!r)
      return api.sendMessage(
        "No results found.",
        replier.received.tid,
        replier.received.mid,
      );
    if (replier.received.step === "search") {
      let index = replier.data.msg;
      const num = parseInt(index);
      if (isNaN(num)) {
        return api.sendMessage(
          "Please provide a valid number",
          replier.received.tid,
          replier.received.mid,
        );
      }
      if (num < 1 || num > r.length) {
        return api.sendMessage(
          "Invalid number",
          replier.received.tid,
          replier.received.mid,
        );
      }
      const result = r[num - 1];
      api.sendMessage(
        "Downloading...",
        replier.received.tid,
        replier.received.mid,
      );
      const link = result.link;
      const dl = await axios.get(`${global.deku.ENDPOINT}/api/xdl?q=${link}`);
      const links = dl.data.result.files.high;
      const res = (
        await axios.get(encodeURI(links), { responseType: "arraybuffer" })
      ).data;
      fs.writeFileSync(xpath, Buffer.from(res, "utf-8"));
      /*if (fs.statSync(xpath).size > 26214400) {
        api.sendMessage("File size is too large. Bot can send only 24 MB below.", replier.received.tid, replier.received.mid);
        return fs.unlinkSync(xpath);
      }*/
      await api.sendMessage(
        { attachment: fs.createReadStream(xpath) },
        replier.received.tid,
        replier.received.mid,
      );
    }
  },
};
