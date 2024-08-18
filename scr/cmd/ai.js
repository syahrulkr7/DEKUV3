const axios = require('axios');

module.exports = {
  config: {
    name: "ai",
    description: "AI command to process photos or answer text-based questions.",
    usage: "ai [prompt or question] [photo (optional)]",
    cooldown: 2,
    accessableby: 0,
    category: "general",
    prefix: false,
    aliases: ["gemini"],
  },
  start: async function ({ api, text, event, reply }) {
    try {
      const prompt = text.join(" ");

      console.log("Event Attachments:", event.attachments);

      if (event.attachments && event.attachments.length > 0) {
        const attachment = event.attachments[0];

        console.log("Attachment Type:", attachment.type);

        if (attachment.type === 'photo') {
          const photoUrl = attachment.url;

          console.log("Photo URL:", photoUrl);

          const response = await axios.get(`https://ggwp-ifzt.onrender.com/gemini?prompt=${encodeURIComponent(prompt)}&url=${photoUrl}`);

          if (response.data && response.data.gemini) {
            return reply(`✨ 𝙲𝚑𝚒𝚕𝚕𝚒 𝚁𝚎𝚜𝚙𝚘𝚗𝚜𝚎\n━━━━━━━━━━━━━━━━━━\n${response.data.gemini}\n━━━━━━━━━━━━━━━━━━\n-𝙱𝚒𝚗𝚐 𝙲𝚑𝚞𝚛𝚌𝚑𝚒𝚕𝚕`);
          } else {
            return reply(`✨ 𝙲𝚑𝚒𝚕𝚕𝚒 𝚁𝚎𝚜𝚙𝚘𝚗𝚜𝚎\n━━━━━━━━━━━━━━━━━━\nSorry, I couldn't process the photo with that prompt. Please try again.\n━━━━━━━━━━━━━━━━━━\n-𝙱𝚒𝚗𝚐 𝙲𝚑𝚞𝚛𝚌𝚑𝚒𝚕𝚕`);
          }
        } else {
          return reply(`✨ 𝙲𝚑𝚒𝚕𝚕𝚒 𝚁𝚎𝚜𝚙𝚘𝚗𝚜𝚎\n━━━━━━━━━━━━━━━━━━\nPlease attach a valid photo.\n━━━━━━━━━━━━━━━━━━\n-𝙱𝚒𝚗𝚐 𝙲𝚑𝚞𝚛𝚌𝚑𝚒𝚕𝚕`);
        }
      }

      if (text.length > 0) {
        const response = await axios.get(`https://ggwp-ifzt.onrender.com/gemini?prompt=${encodeURIComponent(prompt)}`);

        if (response.data && response.data.gemini) {
          return reply(`✨ 𝙲𝚑𝚒𝚕𝚕𝚒 𝚁𝚎𝚜𝚙𝚘𝚗𝚜𝚎\n━━━━━━━━━━━━━━━━━━\n${response.data.gemini}\n━━━━━━━━━━━━━━━━━━\n-𝙱𝚒𝚗𝚐 𝙲𝚑𝚞𝚛𝚌𝚑𝚒𝚕𝚕`);
        } else {
          return reply(`✨ 𝙲𝚑𝚒𝚕𝚕𝚒 𝚁𝚎𝚜𝚙𝚘𝚗𝚜𝚎\n━━━━━━━━━━━━━━━━━━\nSorry, I couldn't answer your question. Please try again.\n━━━━━━━━━━━━━━━━━━\n-𝙱𝚒𝚗𝚐 𝙲𝚑𝚞𝚛𝚌𝚑𝚒𝚕𝚕`);
        }
      }

      return reply(`✨ 𝙲𝚑𝚒𝚕𝚕𝚒 𝚁𝚎𝚜𝚙𝚘𝚗𝚜𝚎\n━━━━━━━━━━━━━━━━━━\nPlease provide a photo with a prompt or ask a question.\n━━━━━━━━━━━━━━━━━━\n-𝙱𝚒𝚗𝚐 𝙲𝚑𝚞𝚛𝚌𝚑𝚒𝚕𝚕`);
    } catch (error) {
      console.error("Error handling AI command:", error);
      return reply(`✨ 𝙲𝚑𝚒𝚕𝚕𝚒 𝚁𝚎𝚜𝚙𝚘𝚗𝚜𝚎\n━━━━━━━━━━━━━━━━━━\nAn error occurred while processing your request. Please try again later.\n━━━━━━━━━━━━━━━━━━\n-𝙱𝚒𝚗𝚐 𝙲𝚑𝚞𝚛𝚌𝚑𝚒𝚕𝚕`);
    }
  },
};
