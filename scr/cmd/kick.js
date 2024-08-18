module.exports = {
  config: {
    name: "kick",
    description: "Kick mentioned users from the group chat",
    usage: "kick @mention1 @mention2 ...",
    cooldown: 0,
    accessableby: 2,
    category: "Moderation",
    prefix: false
  },
  start: async function ({ api, text, react, event, reply, User }) {
    try {
      const botID = api.getCurrentUserID();
      const threadInfo = await api.getThreadInfo(event.threadID);
      
      if (!threadInfo.adminIDs.some(admin => admin.id === botID)) {
        return reply("I need to be an admin to kick users. Please make me an admin first.");
      }
      
      const mentions = event.mentions;
      let usersToKick = [];

      if (event.messageReply) {
        usersToKick.push(event.messageReply.senderID);
      } else if (Object.keys(mentions).length > 0) {
        usersToKick = Object.keys(mentions);
      } else {
        return reply("Please mention the users you want to kick or reply to their message.");
      }

      let message = "Kicked the following users:\n\n";
      for (const userID of usersToKick) {
        await api.removeUserFromGroup(userID, event.threadID);
        message += `${userID}\n`;
      }
      
      reply(message);
    } catch (error) {
      reply(`Error: ${error.message}`);
    }
  },
  auto: async function ({ api, event, text, reply }) {}
};
