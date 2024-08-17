const axios = require("axios");
const fs = require("fs");
module.exports = {
  config: {
    name: "create",
    refix: false,
    accessibleby: 0,
    description: "Generate matching avatar and cover",
    credits: "Deku",
    category: "image",
    usage: "[name | last name | id | color]",
    cooldown: 4
  },
  start: async function ({ api, reply, event }) {
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
            global.memory.cover[replier.data.uid] = {
              // wag ilagay previous data
              name,
            };
          },
          replier.received.mid,
        );
      } else if (replier.received.step == "lastname") {
        // FOR LAST NAME
        const last = replier.data.msg;
        await api.sendMessage(
          `Your last name ${last} has been saved.\nPlease reply again on this message for character id`,
          replier.received.tid,
          async (error, info) => {
            if (error) return;
            global.handle.replies[info.messageID] = {
              cmdname: module.exports.config.name,
              tid: replier.received.tid,
              mid: replier.received.mid,
              this_mid: info.messageID,
              this_tid: info.threadID,
              step: "id",
            };
            global.memory.cover[replier.data.uid] = {
              ...(global.memory.cover[replier.data.uid] || {}),
              last,
            };
          },
          replier.received.mid,
        );
      } else if (replier.received.step == "id") {
        // FOR PHONE NUM
        const id = replier.data.msg;
        await api.sendMessage(
          `Your selected ID "${id}" has been saved. Please reply again on this message for color`,
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
            global.memory.cover[replier.data.uid] = {
              ...(global.memory.cover[replier.data.uid] || {}),
              id,
            };
          },
          replier.received.mid,
        );
      }  else if (replier.received.step == "color") {
        console.log("last works");
        api.sendMessage("Generating...", replier.received.tid, replier.received.mid);
        // LAST STEP
        const color = replier.data.msg;

        const { name, last, id } =
          global.memory.cover[replier.data.uid];
        const cover = (await axios.get(global.deku.ENDPOINT + "/canvas/fbcoverv5?name=" + name + "&subname=" + last + "&id=" + id + "&color=" + color, {
          responseType: "stream",
        })).data;

        const cover1 = (await axios.get(global.deku.ENDPOINT + `/canvas/fbcoverv2?name=${name}&id=${id}&subname=${last}&color=${color}`, {
          responseType: "stream",
        })).data

        const pfp = (await axios.get(global.deku.ENDPOINT + "/canvas/avatarv2?bgtext=" + name + "&signature=" + name + " " + last + "&id=" + id + "&color=" + color, {
          responseType: "stream",
        })).data;

        const pfp1 = (await axios.get(global.deku.ENDPOINT + `/canvas/avatar?id=${id}&bgname=${name}&signature=${name}%20${last}&color=${color}`, {
          responseType: "stream",
        })).data;

        const img = []
        img.push(cover)
        img.push(pfp)
        img.push(cover1)
        img.push(pfp1)
        const msg = {
          body: "Here's your matching cover and avatar.",
          attachment: img
        }
        api.sendMessage(msg, replier.received.tid, replier.received.mid);
      }
    } catch (e) {
      console.log(e.message);
      return api.sendMessage(
        e.title,
        replier.received.tid,
        replier.received.mid,
      );
    }
  },
};
   