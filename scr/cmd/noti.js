module.exports.config = {
  name: "noti",
  prefix: true,
  accessableby: 1,
  description: "Send a notification to all groups.",
  usage: "[msg]",
  cooldown: 0
}

module["exports"]["start"] = async function({ api, event, text }) {
  const message = text.join(" ");
  const threadList = await api.getThreadList(100, null, ["INBOX"]).catch(error => console.error('Failed to get Thread List:', error));
 // const botAdmin = (await api.getUserInfoV2(event.senderID)).name;
  let groupCount = 0;
  for (const thread of threadList) {
    if (thread.isGroup) {
      groupCount++;
      const threadName = thread.name || "";
      const msg = `Notification for group ${threadName}

Message: ${message}`;

  await api.sendMessage(msg, thread.threadID).catch(error => console.error('Failed to send message:', error));

    }
  }

 return api.sendMessage(`Notification sent to ${groupCount} groups`, event.threadID, event.messageID);
}