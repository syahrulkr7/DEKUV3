module.exports = {
  config: {
    name: "out",
    description: "remove the bot from the group",
    usage: "out",
    prefix: true,
    accessableby: 0,
    category: "system",
    cooldown: 0,
  },
  start: async function ({ api, event }) {
    api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
  },
};