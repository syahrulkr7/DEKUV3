const { createReadStream, writeFileSync } = require("fs");
const axios = require("axios");
module.exports = {
  config: {
    name: "chart",
    cooldown: 0,
    author: "Deku",
    accessableby: 0,
    description: "Create interactive diagrams with top 8 groups",
    category: "image",
    prefix: false,
  },
  start: async function ({ event, api, reply }) {
    try {
      var deck = (data) => data.reduce((a, b) => a + b, 0);
      var inbox = await api.getThreadList(100, null, ["INBOX"]);
      let xx = [...inbox].filter(
        (group) => group.isSubscribed && group.isGroup,
      );
      var ok = [],
        search = [],
        count = [];
      for (let n of xx) {
        var threadInfo = n.name;
        var threadye = n.messageCount;
        ok.push({
          name: threadInfo,
          exp: typeof (await threadye) == "undefined" ? 0 : await threadye,
        });
      }
      ok.sort(function (a, b) {
        return b.exp - a.exp;
      });
      for (let num = 0; num < 8; num++) {
        search.push("'" + ok[num].name + "'");
        count.push(ok[num].exp);
      }
      var path = __dirname + `/cache/chart.png`;
      var full = await deck(count);
      var url = `https://quickchart.io/chart?c={type:'doughnut',data:{labels:[${encodeURIComponent(search)}],datasets:[{label:'${encodeURIComponent("Interact")}',data:[${encodeURIComponent(count)}]}]},options:{plugins:{doughnutlabel:{labels:[{text:'${full}',font:{size:26}},{text:'${encodeURIComponent("Total")}'}]}}}}`;
      const { data: stream } = await axios.get(url, {
        method: "GET",
        responseType: "arraybuffer",
      });
      writeFileSync(path, Buffer.from(stream, "utf-8"));
      return api.sendMessage(
        { body: "", attachment: createReadStream(path) },
        event.threadID,
        event.messageID,
      );
    } catch (e) {
      return reply(e.message);
    }
  },
};
