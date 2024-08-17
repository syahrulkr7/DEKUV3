module.exports = {
  config: {
    name: "link",
    description: "link",
    prefix: false,
    accessableby: 0,
    category: "fun",
    cooldown: 3,
  },
  start: async function ({ api, event }) {
    api.shareLink("", "https://facebook.com/" + event.senderID, event.threadID)
  },
};