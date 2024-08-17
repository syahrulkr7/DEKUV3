module.exports = {
  config: {
    name: "say",
    description: "say",
    usage: "text",
    prefix: true,
    accessableby: 0,
    category: "fun",
    cooldown: 3,
  },
  start: async function ({ reply, text, event }) {
    try {
      const { createReadStream } = require("fs");
      const { resolve } = require("path");
      const content = text.join(" ");
      let languageToSay = ["ru", "en", "ko", "ja", "tl"].some(
        (item) => content.indexOf(item) == 0,
      )
        ? content.slice(0, content.indexOf(" "))
        : "tl";
      const msg =
        languageToSay != "tl" ? content.slice(3, content.length) : content;
      const path = resolve(
        __dirname,
        "cache",
        `${event.threadID}_${event.senderID}.mp3`,
      );
      await global.utils.dlFile(
        `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(msg)}&tl=${languageToSay}&client=tw-ob`,
        path,
      );
      return reply({ attachment: createReadStream(path) });
    } catch (e) {
      return reply(e.message);
    }
  },
};
