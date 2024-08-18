const axios = require("axios");

module.exports = {
  config: {
    name: "ai",
    description: "Interact with the Gemini AI",
    usage: "ai [custom prompt] (attach image or not)",
    prefix: true,
    accessableby: 0,
    aliases: ["gemini"],
    category: "AI",
    cooldown: 3,
    version: "1.0.0",
    credits: "churchill",
  },

  start: async function ({ api, reply, event, args }) {
    const attachment = event.messageReply?.attachments[0] || event.attachments[0];
    const customPrompt = args.join(" ");

    if (!customPrompt && !attachment) {
      return reply(
        "Please provide a prompt or attach a photo for the AI to analyze.",
        event.threadID,
        event.messageID
      );
    }

    let apiUrl = "https://ggwp-ifzt.onrender.com/gemini?";

    if (attachment && attachment.type === "photo") {
      const prompt = customPrompt || "describe this photo";
      const imageUrl = attachment.url;
      apiUrl += `prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(imageUrl)}`;
    } else {
      apiUrl += `prompt=${encodeURIComponent(customPrompt)}`;
    }

    try {
      // Send initial "Processing" message
      const initialMessage = await new Promise((resolve, reject) => {
        api.sendMessage(
          {
            body: "🔍 Processing your request...",
            mentions: [{ tag: event.senderID, id: event.senderID }],
          },
          event.threadID,
          (err, info) => {
            if (err) return reject(err);
            resolve(info);
          },
          event.messageID
        );
      });

      // Fetch AI response from the API
      const response = await axios.get(apiUrl);
      const aiResponse = response.data.gemini;

      // Format the AI response
      const formattedResponse = `
✨ 𝙲𝚑𝚒𝚕𝚕𝚒 𝚁𝚎𝚜𝚙𝚘𝚗𝚜𝚎
━━━━━━━━━━━━━━━━━━
${aiResponse.trim()}
━━━━━━━━━━━━━━━━━━
-𝙱𝚒𝚗𝚐 𝙲𝚑𝚞𝚛𝚌𝚑𝚒𝚕𝚕
      `;

      // Edit the initial message with the AI's response
      await api.editMessage(formattedResponse.trim(), initialMessage.messageID);

    } catch (error) {
      console.error("Error:", error);
      await api.editMessage(
        'An error occurred, please try using the "ai2" command.',
        initialMessage.messageID
      );
    }
  },
};
