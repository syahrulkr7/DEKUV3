const Deku = require("dekuai");
const deku = new Deku();
const fs = require("fs");

module.exports = {
  config: {
    name: "fbcover",
    refix: false,
    accessibleby: 0,
    description: "Generate facebook cover",
    credits: "Deku",
    category: "image",
    usage: "[name | last name | cp number | country | email | color]",
    cooldown: 4
  },
  start: async function ({ text, api, reply, react, event }) {
    try {
      await api.sendMessage(
        "Please reply to this message with your name",
        event.threadID,
        async (error, info) => {
          if (error) return;
          global.handle.replies[info.messageID] = {
            cmdname: module.exports.config.name,
            tid: event.threadID,
            mid: event.messageID,
            uid: event.senderID,
            this_mid: info.messageID,
            this_tid: info.threadID,
            step: "name",
          };
        },
        event.messageID,
      );
    } catch (e) {
      return reply(e.message);
    }
  },
  startReply: async function ({ api, replier }) {
    try {
      if (replier.received.step == "name") {
        // FOR NAME
        const name = replier.data.msg;
        await api.sendMessage(
          `Your name ${name} has been saved.\nPlease reply again on this message for last name`,
          replier.received.tid,
          async (error, info) => {
            if (error) return;
            global.handle.replies[info.messageID] = {
              cmdname: module.exports.config.name,
              tid: replier.received.tid,
              mid: replier.received.mid,
              this_mid: info.messageID,
              this_tid: info.threadID,
              step: "lastname",
            };
            global.memory.fbcover[replier.data.uid] = {
              name,
            };
          },
          replier.received.mid,
        );
      } else if (replier.received.step == "lastname") {
        // FOR LAST NAME
        const last = replier.data.msg;
        await api.sendMessage(
          `Your last name ${last} has been saved.\nPlease reply again on this message for phone number`,
          replier.received.tid,
          async (error, info) => {
            if (error) return;
            global.handle.replies[info.messageID] = {
              cmdname: module.exports.config.name,
              tid: replier.received.tid,
              mid: replier.received.mid,
              this_mid: info.messageID,
              this_tid: info.threadID,
              step: "cpnumber",
            };
            global.memory.fbcover[replier.data.uid] = {
              ...(global.memory.fbcover[replier.data.uid] || {}),
              last,
            };
          },
          replier.received.mid,
        );
      } else if (replier.received.step == "cpnumber") {
        // FOR PHONE NUM
        const phone = replier.data.msg;
        await api.sendMessage(
          `Your phone number: "${phone}" has been saved.\nPlease reply again on this message for country name`,
          replier.received.tid,
          async (error, info) => {
            if (error) return;
            global.handle.replies[info.messageID] = {
              cmdname: module.exports.config.name,
              tid: replier.received.tid,
              mid: replier.received.mid,
              this_mid: info.messageID,
              this_tid: info.threadID,
              step: "country",
            };
            global.memory.fbcover[replier.data.uid] = {
              ...(global.memory.fbcover[replier.data.uid] || {}),
              phone,
            };
          },
          replier.received.mid,
        );
      } else if (replier.received.step == "country") {
        // FOR COUNTRY
        const country = replier.data.msg;
        await api.sendMessage(
          `Your country name: "${country}" has been saved.\nPlease reply again on this message for email address`,
          replier.received.tid,
          async (error, info) => {
            if (error) return;
            global.handle.replies[info.messageID] = {
              cmdname: module.exports.config.name,
              tid: replier.received.tid,
              mid: replier.received.mid,
              this_mid: info.messageID,
              this_tid: info.threadID,
              step: "email",
            };
            global.memory.fbcover[replier.data.uid] = {
              ...(global.memory.fbcover[replier.data.uid] || {}),
              country,
            };
          },
          replier.received.mid,
        );
      } else if (replier.received.step == "email") {
        // FOR EMAIL
        const email = replier.data.msg;
        await api.sendMessage(
          `Your email: "${email}" has been saved.\nPlease reply again on this message for color`,
          replier.received.tid,
          async (error, info) => {
            if (error) return;
            global.handle.replies[info.messageID] = {
              cmdname: module.exports.config.name,
              tid: replier.received.tid,
              mid: replier.received.mid,
              this_mid: info.messageID,
              this_tid: info.threadID,
              step: "color",
            };
            global.memory.fbcover[replier.data.uid] = {
              ...(global.memory.fbcover[replier.data.uid] || {}),
              email,
            };
          },
          replier.received.mid,
        );
      } else if (replier.received.step == "color") {
        console.log("last works");
        // LAST STEP
        const color = replier.data.msg;

        const { name, last, phone, country, email } =
          global.memory.fbcover[replier.data.uid];
        const k = await deku.fbcover(
          name,
          last,
          phone,
          country,
          email,
          replier.data.uid,
          color,
        );
        const path = __dirname + "/cache/fbcover.png";
        fs.writeFileSync(path, k);
        api.sendMessage(
          {
            attachment: fs.createReadStream(path),
          },
          replier.received.tid,
          replier.received.mid,
        );
      }
    } catch (e) {
      console.log(e.message);
      return api.sendMessage(e.message, replier.received.tid, replier.received.mid);
    }
  },
};
