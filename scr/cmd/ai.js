const axios = require('axios');

module.exports = {
  config: {
    name: "ai",
    description: "AI command to process photos or answer text-based questions.",
    usage: "ai [prompt or question] [photo (optional)]",
    cooldown: 2,
    accessableby: 0,
    category: "general",
    prefix: true,
  },
  start: async function ({ api, text, event, reply }) {
    try {
      const prompt = text.join(" ");
      
      // Log to see if the ev
      console.log("Event Attachments:", event.attachments);

      if (event.attachments && event.attachments.length > 0) {
        const attachment = event.attachments[0];
        
        // Log the typ
        console.log("Attachment Type:", attachment.type);
        
        if (attachment.type === 'photo') {
          const photoUrl = attachment.url;

          // Log the 
          console.log("Photo URL:", photoUrl);

          const response = await axios.get(`https://ggwp-ifzt.onrender.com/gemini?prompt=${encodeURIComponent(prompt)}&url=${photoUrl}`);

          if (response.data && response.data.gemini) {
            return reply(response.data.gemini);
          } else {
            return reply("Sorry, I couldn't process the photo with that prompt. Please try again.");
          }
        } else {
          return reply("Please attach a valid photo.");
        }
      }

      if (text.length > 0) {
        const response = await axios.get(`https://ggwp-ifzt.onrender.com/gemini?prompt=${encodeURIComponent(prompt)}`);

        if (response.data && response.data.gemini) {
          return reply(response.data.gemini);
        } else {
          return reply("Sorry, I couldn't answer your question. Please try again.");
        }
      }

      return reply("Please provide a photo with a prompt or ask a question.");
    } catch (error) {
      console.error("Error handling AI command: try use ai2", error);
      return reply("An error occurred while processing your request. Please try again later.");
    }
  },
};
