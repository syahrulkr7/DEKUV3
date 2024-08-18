const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "noti",
    prefix: true,
    accessableby: 1, // 0 = everyone, 1 = admins
    description: "Send a notification to all groups.",
    usage: "[msg]",
    cooldown: 0
  },
  start: async function ({ api, event, text, reply }) {
    const message = text.join(" ");
    
    if (!message) {
      return reply("Please provide a message to send as a notification.");
    }

    // Fetch thread list from the inbox with a limit of 100
    const threadList = await api.getThreadList(100, null, ["INBOX"]).catch(error => {
      console.error('Failed to get Thread List:', error);
      return reply("Failed to retrieve thread list.");
    });

    let groupCount = 0;

    // Loop through each thread in the thread list
    for (const thread of threadList) {
      if (thread.isGroup) {
        const threadName = thread.name || "Unnamed Group";
        const msg = `Notification for group ${threadName}\n\nMessage: ${message}`;

        try {
          // Send the text message
          await api.sendMessage(msg, thread.threadID);
          groupCount++;

          // Generate and send the audio message
          const pathFemale = path.resolve(__dirname, "cache", `${thread.threadID}_female.mp3`);
          await downloadFile(
            `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(message)}&tl=tl&client=tw-ob&idx=1`,
            pathFemale
          );

          await api.sendMessage(
            { attachment: fs.createReadStream(pathFemale) },
            thread.threadID,
            () => fs.unlinkSync(pathFemale)
          );

        } catch (error) {
          console.error(`Failed to send message to ${threadName} (${thread.threadID}):`, error);
        }
      }
    }

    reply(`Notification sent to ${groupCount} groups.`);
  }
};

async function downloadFile(url, filePath) {
  const writer = fs.createWriteStream(filePath);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
