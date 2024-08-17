module.exports = {
  config: {
    name: "test",
    description: "test",
    prefix: false,
    usage: "[test]",
    accessableby: 1,
    cooldown: 0
  },
  start: async function ({ text, api, event, reply }) {
    const { threadID, messageID } = event;
    const send = (o) => {
      try {
        if (typeof o === "object" && o !== null) {
          if (o.body || o.attachment) o = o;
          if (Array.isArray(o)) o = o.join("\n").toString();
          else o = Object.entries(o).join("\n").toString();
        }
        api.sendMessage(
          o,
          threadID,
          (err, info) => {
            if (err) send(err);
          },
          messageID,
        );
      } catch (e) {
        console.log(e);
      }
    };
    try {
      if (text.length == 0)
        return api.sendMessage(
          "Args is not defined",
          event.threadID,
          event.messageID,
        );
      eval(text.join(" "));
    } catch (error) {
      send("Test failed with error:" + error);
    }
  },
};
